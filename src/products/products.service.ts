import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from 'generated/prisma/client';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('ProductService');
  onModuleInit() {
    this.$connect();
    this.logger.log('Database connected');
  }

  create(createProductDto: CreateProductDto) {
    return this.product.create({
      data: createProductDto,
    });
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit, page } = paginationDto;

    const totalPages = await this.product.count({ where: { available: true } });
    const lastPage = Math.ceil(totalPages / limit);

    if (page < 1 || page > lastPage) {
      throw new NotFoundException(`Page ${page} not found`);
    }

    return {
      data: await this.product.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: { available: true },
      }),
      meta: {
        total: totalPages,
        page: page,
        last_page: lastPage,
      },
    };
  }

  async findOne(id: number) {
    const product = await this.product.findFirst({
      where: { id, available: true },
    });

    if (!product) {
      throw new NotFoundException(`Product with id #${id} not found`);
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    await this.findOne(id);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _, ...data } = updateProductDto;

    return this.product.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    const product = await this.product.update({
      where: { id },
      data: { available: false },
    });

    // Soft delete: mark as unavailable
    return product;

    // hard delete
    // return this.product.delete({
    //   where: { id },
    // });
  }
}
