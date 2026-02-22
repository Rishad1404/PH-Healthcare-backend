export const convertDateTime=async(date:Date)=>{
    const offset=date.getTimezoneOffset() * 60 * 1000;
    const newDate = new Date(date.getTime() + offset);
    return newDate;
}