type statusOptions = ['active', 'cancelled', 'completed'] ;

export interface IAppointment {
    id: number;
    date: string;
    time: string;
    userId: number;
    status: "active" | "cancelled" | "completed";
    userEmail: string;
}

export interface CreateAppointmentDto {
    date: string;
    time: string;
    userId: number;
    serviceId: number;
}