import PDFDocument from 'pdfkit';
import { envVars } from '../../../config/env';

interface PrescriptionData {
    doctorName: string;
    doctorEmail: string;
    patientName: string;
    patientEmail: string;
    followUpDate: Date;
    instructions: string;
    prescriptionId: string;
    appointmentDate: Date;
    createdAt: Date;
}

export const generatePrescriptionPDF = async (prescriptionData: PrescriptionData): Promise<Buffer> => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({
                size: 'A4',
                margin: 40,
            });

            const chunks: Buffer[] = [];

            doc.on('data', (chunk) => {
                chunks.push(chunk);
            });

            doc.on('end', () => {
                resolve(Buffer.concat(chunks));
            });

            doc.on('error', (error) => {
                reject(error);
            });

            const primaryColor = '#1F2937';
            const accentColor = '#3B82F6';
            const lightGray = '#F3F4F6';
            const borderColor = '#E5E7EB';

            // Header Background
            doc.rect(40, 40, 515, 100).fill(primaryColor);

            // Header Text
            doc.fontSize(28).font('Helvetica-Bold').fillColor('#FFFFFF')
                .text('Prescription', 50, 55, { align: 'left' });

            doc.fontSize(11).font('Helvetica').fillColor('#E0E7FF')
                .text('PH Healthcare Services', 50, 90)
                .text('Your Health, Our Priority', 50, 105);

            doc.fillColor(primaryColor);
            doc.moveDown(3);

            // Prescription ID Box
            const idBoxY = doc.y;
            doc.rect(40, idBoxY, 515, 35).stroke(accentColor);
            doc.fontSize(10).font('Helvetica').fillColor(accentColor)
                .text('PRESCRIPTION ID', 50, idBoxY + 5);
            doc.fontSize(12).font('Helvetica-Bold').fillColor(primaryColor)
                .text(prescriptionData.prescriptionId, 50, idBoxY + 18);

            doc.moveDown(2.5);

            // Two Column Layout
            const leftX = 50;
            const rightX = 310;
            const columnY = doc.y;

            // Doctor Information Box
            doc.rect(leftX, columnY, 240, 90).stroke(borderColor);
            doc.fontSize(10).font('Helvetica-Bold').fillColor(accentColor)
                .text('DOCTOR', leftX + 10, columnY + 8);

            doc.fontSize(11).font('Helvetica-Bold').fillColor(primaryColor)
                .text(prescriptionData.doctorName, leftX + 10, columnY + 25);

            doc.fontSize(9).font('Helvetica').fillColor('#6B7280')
                .text(prescriptionData.doctorEmail, leftX + 10, columnY + 43);

            // Patient Information Box
            doc.rect(rightX, columnY, 240, 90).stroke(borderColor);
            doc.fontSize(10).font('Helvetica-Bold').fillColor(accentColor)
                .text('PATIENT', rightX + 10, columnY + 8);

            doc.fontSize(11).font('Helvetica-Bold').fillColor(primaryColor)
                .text(prescriptionData.patientName, rightX + 10, columnY + 25);

            doc.fontSize(9).font('Helvetica').fillColor('#6B7280')
                .text(prescriptionData.patientEmail, rightX + 10, columnY + 43);

            doc.moveDown(5);

            // Dates Information
            const datesY = doc.y;
            doc.fontSize(10).font('Helvetica-Bold').fillColor(primaryColor)
                .text('APPOINTMENT DETAILS', 50, datesY);

            doc.fontSize(9).font('Helvetica').fillColor('#6B7280');
            const appointmentDate = new Date(prescriptionData.appointmentDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
            const issuedDate = new Date(prescriptionData.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });

            doc.text(`Appointment Date: ${appointmentDate}`, 50, datesY + 20);
            doc.text(`Issued Date: ${issuedDate}`, 310, datesY + 20);

            if (prescriptionData.followUpDate) {
                const followUpDate = new Date(prescriptionData.followUpDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                });
                doc.text(`Follow-up Date: ${followUpDate}`, 50, datesY + 35);
            }

            doc.moveDown(3);

            // Instructions Section
            const instructionsY = doc.y;
            doc.rect(40, instructionsY, 515, 25).fill(lightGray);
            doc.fontSize(11).font('Helvetica-Bold').fillColor(primaryColor)
                .text('INSTRUCTIONS & MEDICATIONS', 50, instructionsY + 5);

            doc.moveDown(2.5);

            // Instructions Content Box
            const contentY = doc.y;
            doc.rect(40, contentY, 515, 120).stroke(borderColor);

            doc.fontSize(10).font('Helvetica').fillColor(primaryColor);
            doc.text(prescriptionData.instructions, 50, contentY + 10, {
                align: 'left',
                width: 495,
                lineGap: 5,
            });

            doc.moveDown(8);

            // Divider Line
            doc.moveTo(40, doc.y).lineTo(555, doc.y).stroke(borderColor);

            doc.moveDown(1);

            // Footer
            doc.fontSize(8).font('Helvetica').fillColor('#9CA3AF')
                .text(
                    'This is an electronically generated prescription. Please follow all instructions provided by your doctor.',
                    { align: 'center', width: 515 }
                );

            doc.text(`For more information, visit: ${envVars.FRONTEND_URL}`, {
                align: 'center',
                width: 515,
            });

            doc.fontSize(7).fillColor('#D1D5DB')
                .text(`Generated on ${new Date().toLocaleString()}`, { align: 'center', width: 515 });

            // End the document
            doc.end();
        } catch (error) {
            reject(error);
        }
    });
};