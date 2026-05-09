export const matchSearch = (search: string, fields: string[]) => {
     if (!search) return true;
   
     const keyword = search.toLowerCase();
   
     return fields.some(field =>
       field?.toLowerCase().includes(keyword)
     );
   };