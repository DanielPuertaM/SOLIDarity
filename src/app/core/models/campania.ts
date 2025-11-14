export interface CampaniaRequest{
    titulo: string;
    idBeneficiario: number;
    descripcion: string;
    montoObjetivo: number;
}

export interface CampaniaResponse {
    id: number;
    idBeneficiario: number;
    titulo: string;
    status: string;
    montoObjetivo: number;
    montoRecaudado: number;
    imagenUrl: string;
}

export interface CampaniaResponseCompleta {
    id: number;
    idBeneficiario: number;
    titulo: string;
    status: string;
    montoObjetivo: number;
    montoRecaudado: number;
    imagenUrl: string;
    descripcion: string;
    fechaInicio: string;
}

export enum StatusCampania {
    EN_PROGRESO = "EN_PROGRESO",
    COMPLETADA = "COMPLETADA",
    RECHAZADA = "RECHAZADA",
    PAUSADA = "PAUSADA",
    ACTIVADA = "ACTIVADA",
    PENDIENTE = "PENDIENTE",

}

