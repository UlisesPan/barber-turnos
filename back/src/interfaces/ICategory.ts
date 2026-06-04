export interface ICategory {
    id: number;
    name: string;
    duration: number;
    price: number;
}

export interface ICreateCategoryDto extends Omit<ICategory, 'id'> {}
