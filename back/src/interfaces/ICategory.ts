export interface ICategory {
    id: number;
    name: string;
    duration: number;
    price: number;
    image?: string;
}

export type ICreateCategoryDto = Omit<ICategory, 'id'>;
