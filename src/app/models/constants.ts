
export const FieldsNotToParse: ({ field: string, filename: string, datasource: string } | { field: string, filename: string } | { field: string })[] = [
    { /*datasource: 'COVID-19-Impfungen_in_Deutschland',*/ filename: 'Aktuell_Deutschland_Landkreise_COVID-19-Impfungen.csv', field: 'LandkreisId_Impfort' }
];

export const ROW_COUNT_FILTER_LIMIT = 999999;