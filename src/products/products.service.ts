import { HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { ProductSearchDto } from './dto/product-search.dto';
import { throwError } from 'rxjs';
import { Sale } from 'src/sales/entities/sale.entity';


@Injectable()
export class ProductsService {

  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(Sale)
    private readonly saleRepository: Repository<Sale>,
  ){}


  async create(createProductDto: CreateProductDto) {
    try {
      const product = this.productsRepository.create(createProductDto);
      await this.productsRepository.save(product);

      return {
        ok: true, 
        message: "producto creado",
        status: HttpStatus.CREATED
      }
    } catch (error) {
      throw new NotFoundException('Ocurrio un error ${error.message}')
    }
  }

  async findAll({name, page, limit}: ProductSearchDto) {
    try {
      page = page ?? 1
      limit = limit ?? 5
      
      console.log({page, limit})
      const [products, total] = await this.productsRepository.findAndCount({
        where: {
            isActive: true,
        },
        order: { id: 'DESC' },
        skip: (page - 1) * limit,
        take: limit,
      });
      console.log(products)
      if (products.length > 0) {
        
        let totalPag: number = limit > 0 ? Math.ceil(total / limit) : 0;
        let currentPage: number = Number(page);  // Asegurarse de que page es un número
        let nextPag: number = currentPage >= totalPag ? currentPage : currentPage + 1;
        let prevPag: number = currentPage <= 1 ? currentPage : currentPage - 1;
  
        return {
          ok: true,
          products,
          total,
          totalPag,
          currentPage,
          nextPag,
          prevPag,
          message: 'user found succesfully',
          status: HttpStatus.OK,
        };
      }
    } catch (error) {
      throw new NotFoundException(`Ocurrio un error ${error.message}`);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }

  async report({name, quantity}: ProductSearchDto){
    
  }
}