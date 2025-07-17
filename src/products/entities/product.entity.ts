interface UpdateProductOptions {
  name?: string;
  description?: string;
  price?: number;
}

export class Product {
  // id: string;
  // name: string;
  // description?: string;
  // price: number;

  constructor(
    public readonly id: string,
    public name: string,
    public description: string,
    public price: number,
  ) {}

  updateWith({ name, description, price }: UpdateProductOptions) {
    this.name = name ?? this.name;
    this.description = description ?? this.description;
    this.price = price ?? this.price;
  }
}
