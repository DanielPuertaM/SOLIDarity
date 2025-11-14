export interface DonacionRequest {
    idUser: number;
    idCampaña: number;
    monto: number;

}

export interface DonacionResponse {
    id: number;
    idUser: number;
    idCampaña: number;
    monto: number;
    fecha: string;
}

