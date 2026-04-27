import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { EmbeddingService } from "./embedding.service";

const toVectorLiteral = (vector: number[]) => `[${vector.join(",")}]`;

export class IndexingService {
  private embeddingService: EmbeddingService;

  constructor() {
    this.embeddingService = new EmbeddingService();
  }

  async indexDocument(
    chunkKey: string,
    sourceType: string,
    sourceId: string,
    content: string,
    sourceLabel?: string,
    metaData?: Record<string, unknown>,
  ) {
    try {
      const embedding = await this.embeddingService.generateEmbedding(content);
      const vectorLiteral = toVectorLiteral(embedding);

      await prisma.$executeRaw(Prisma.sql`
                
                INSERT INTO "document_embeddings" 
                (
                    "id",
                    "chunkKey",
                    "sourceType",
                    "sourceId",
                    "sourceLabel",
                    "content",
                    "metaData",
          "embedding",
          "deletedAt",
          "updatedAt"
                )
                VALUES 
                (
                    ${Prisma.raw("gen_random_uuid()")},
                    ${chunkKey},
                    ${sourceType},
                    ${sourceId},
                    ${sourceLabel || null},
                    ${content},
                    ${JSON.stringify(metaData || {})}::jsonb,
                    ${Prisma.raw(`'${vectorLiteral}'::vector`)},
          ${Prisma.raw('NOW()')},
          NOW()
                ) 
                ON CONFLICT ("chunkKey") 
                DO UPDATE SET 
                    "sourceType" = EXCLUDED."sourceType",
                    "sourceId" = EXCLUDED."sourceId",
                    "sourceLabel" = EXCLUDED."sourceLabel",
                    "content" = EXCLUDED."content",
                    "metaData" = EXCLUDED."metaData",
                    "embedding" = EXCLUDED."embedding",
                    "isDeleted" = false,
                    "deletedAt" = "document_embeddings"."deletedAt",
                    "updatedAt" = NOW();
            `);
            
    } catch (error) {
      console.log(error);
    }
  }

  async indexDoctorsData() {
    try {
      console.log("Fetching doctor data for indexing...");
      const doctors = await prisma.doctor.findMany({
        where: {
          isDeleted: false,
        },
        include: {
          specialties: {
            include: {
              specialty: true,
            },
          },
          reviews: true,
        },
      });
      let indexedCount = 0;
      for (const doctor of doctors) {
        // format specialties into a single string
        const specialtiesList = doctor.specialties
          .map((ds) => ds.specialty.title)
          .join("\n");

        // format reviews into a single string
        const reviewsText = doctor.reviews
          .map(
            (r) =>
              `- Rating: ${r.rating}/5. Comment: ${r.comment}||"No Comment"`,
          )
          .join("\n");

        const content = `Doctor Name: ${doctor.name}
                        Experience: ${doctor.experience} years
                        Qualification: ${doctor.qualification}
                        Designation: ${doctor.designation}
                        Appointment Fee: ${doctor.appointmentFee}
                        Current Working Place: ${doctor.currentWorkplace}
                        Average Rating: ${doctor.averageRating}
                        Specialties: ${specialtiesList || "No Specialties"}
                        Patient Reviews: ${reviewsText || "No Reviews"}
        `;

        const metaData = {
          doctorId: doctor.id,
          name: doctor.name,
          specialties: doctor.specialties.map((ds) => ds.specialty.title),
          averageRating: doctor.averageRating,
          experience: doctor.experience,
        };

        const chunkKey = `doctor-${doctor.id}`;
        await this.indexDocument(
          chunkKey,
          "DOCTOR",
          doctor.id,
          content,
          doctor.name,
          metaData,
        );

        indexedCount++;
      }
      console.log("Successfully indexed", indexedCount, "doctors");
      return {
        success: true,
        message: "Successfully indexed doctors",
        indexedCount,
      };
    } catch (error) {
      console.log(error);
    }
  }
}
