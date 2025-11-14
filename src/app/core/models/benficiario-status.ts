export enum PdfStatus {
    PENDIENTE = 'PENDIENTE',
    APROBADA = 'APROBADA',
    RECHAZADA = 'RECHAZADA',
}

export interface BeneficiarioResponse{
    status: string
}