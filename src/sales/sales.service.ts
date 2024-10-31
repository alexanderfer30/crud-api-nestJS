import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { Sale } from './entities/sale.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { DetailsSale } from 'src/details-sales/entities/details-sale.entity';
import { Product } from 'src/products/entities/product.entity';
import * as moment from 'moment-timezone'
import { SaleSearchDto } from './dto/search-sale.dto';
import { Between, MoreThan, Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { filter, map } from 'rxjs';
import { Console, time } from 'console';
import { DateDto } from './dto/date-sale.dto';
import { Ganancias } from './dto/get-sale.dto';


@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sale)
    private readonly saleRepository: Repository<Sale>,
    @InjectRepository(User)
    private readonly userRepsitory: Repository<User>,
    @InjectRepository(DetailsSale)
    private readonly detailSaleRepository: Repository<DetailsSale>,
    @InjectRepository(Product)
    private readonly productoRepository: Repository<Product>
  ) { }



  async create({products, userId}: CreateSaleDto) {
    console.log({userId, products})
    try {
      const users = await this.userRepsitory.findOne({where: {isActive: true, id: userId}});
      if(!users){
        return {
          ok: true,
          message: 'user not found',
          status: HttpStatus.NOT_FOUND
        }
      }
      const date = moment.tz('America/El_Salvador').format('YYYY-MM-DD')
      const time = moment.tz('America/El_Salvador').format('HH:mm:ss')

      const sale = new Sale()
      sale.date = date as unknown as Date
      sale.time = time as unknown as Date
      sale.user = users 
      sale.total = 0

      const dataSale = await this.saleRepository.save(sale);

      let total = 0 
      for(const product of products){
        const prod = await this.productoRepository.findOne({where: {isActive: true}});

        total += Number(prod.price*product.quantity)

        const detailsSale = new DetailsSale()
        detailsSale.products = prod, 
        detailsSale.quantity = product.quantity,
        detailsSale.total = Number(prod.price*product.quantity)

        await this.detailSaleRepository.save(dataSale);

      }

      dataSale.total = total;
      await this.saleRepository.save(sale);

      return {
        ok: true,
        message: 'Sale created sucessfully',
        status: HttpStatus.CREATED,
        sale
      }
    } catch (error) {
      console.log(error);
      throw new NotFoundException(`Ocurrio un error ${error.message}`)
    }
  }


  /*async createWithTransactions({products, userId }: CreateSaleDto){
    console.log({userId, products})
    const queryRunner = this.saleRepository.manager.connection.createQueryRunner()
    try {
      await queryRunner.connect()
      await queryRunner.startTransaction()

      const users = await this.userRepsitory.findOne({where: {isActive: true, id:userId}});
      if(!users){
        return {
          ok: true,
          message: 'user not found',
          status: HttpStatus.NOT_FOUND
        }
      }

      const date = moment.tz('America/El_Salvador').format('YYYY-MM-DD')
      const time = moment.tz('America/El_Salvador').format('HH:mm:ss')

      const sale = new Sale()
      sale.date = date as any as Date
      sale.time = time as any as Date
      sale.user = users

      await queryRunner.manager.save(sale);

      let total =0

      for(const product of products){
        const prod = await this.productoRepository.findOne({where: {isActive:true, id:product.id}});

        if(!prod){
          throw new NotFoundException(`El producto con id ${product.id} no existe`)
        }

        if (product.quantity > prod.stock) {
          throw new NotFoundException(`No hay suficiente stock para el producto ${prod.name}`)
        }

        //Restar el stock 

        prod.stock-=product.quantity;
        await queryRunner.manager.save(prod);

        const saleDetails = []; // Array para almacenar los detalles de la venta

        total+= Number(prod.price*product.quantity)

        const detailsSale = new DetailsSale()

        detailsSale.sales = sale,
        detailsSale.products = prod,
        detailsSale.quantity = product.quantity,
        detailsSale.total = Number(prod.price * product.quantity)

      const newDetailSale = this.detailSaleRepository.create(detailsSale);
      await queryRunner.manager.save(newDetailSale)

      saleDetails.push({
        product: {
          id: prod.id,
          name: prod.name,
        },
        quantity: product.quantity,
        total: Number(prod.price * product.quantity),
      }); // Almacenar cada detalle en el array
      
      }

      sale.total = total;
      await queryRunner.manager.save(sale);
      await queryRunner.commitTransaction()

      return {
        ok: true,
        message: 'Sale created sucessfully',
        status: HttpStatus.CREATED,
        sale
      }

    } catch (error) {
      await queryRunner.rollbackTransaction()
      console.log(error);
      throw new NotFoundException(`Ocurrio un error ${error.message}`)

    } finally {
      await queryRunner.release()
    }
  }*/

    async createWithTransactions({ products, userId }: CreateSaleDto) {
      console.log({ userId, products });
      const queryRunner = this.saleRepository.manager.connection.createQueryRunner();
      try {
        await queryRunner.connect();
        await queryRunner.startTransaction();
    
        const users = await this.userRepsitory.findOne({ where: { isActive: true, id: userId } });
        if (!users) {
          return {
            ok: true,
            message: 'user not found',
            status: HttpStatus.NOT_FOUND
          };
        }
    
        const date = moment.tz('America/El_Salvador').format('YYYY-MM-DD');
        const time = moment.tz('America/El_Salvador').format('HH:mm:ss');
    
        const sale = new Sale();
        sale.date = date as any as Date;
        sale.time = time as any as Date;
        sale.user = users;
    
        await queryRunner.manager.save(sale);
    
        let total = 0;
        const saleDetails = []; // Array para almacenar los detalles de la venta
    
        for (const product of products) {
          const prod = await this.productoRepository.findOne({ where: { isActive: true, id: product.id } });
    
          if (!prod) {
            throw new NotFoundException(`El producto con id ${product.id} no existe`);
          }
    
          if (product.quantity > prod.stock) {
            throw new NotFoundException(`No hay suficiente stock para el producto ${prod.name}`);
          }
    
          // Restar el stock
          prod.stock -= product.quantity;
          await queryRunner.manager.save(prod);
    
          total += Number(prod.price * product.quantity);
    
          const detailsSale = new DetailsSale();
          detailsSale.sales = sale;
          detailsSale.products = prod;
          detailsSale.quantity = product.quantity;
          detailsSale.total = Number(prod.price * product.quantity);
    
          const newDetailSale = this.detailSaleRepository.create(detailsSale);
          await queryRunner.manager.save(newDetailSale);
    
          saleDetails.push({
            product: {
              id: prod.id,
              name: prod.name,
            },
            quantity: product.quantity,
            total: Number(prod.price * product.quantity),
          }); // Almacenar cada detalle en el array
        }
    
        sale.total = total;
        await queryRunner.manager.save(sale);
        await queryRunner.commitTransaction();
    
        return {
          ok: true,
          message: 'Sale created successfully',
          status: HttpStatus.CREATED,
          sale: {
            date: sale.date,
            time: sale.time,
            total: sale.total,
            user: {
              id: users.id,
              name: users.name,
            },
            details: saleDetails, // Retornar los detalles de la venta
          }
        };
    
      } catch (error) {
        await queryRunner.rollbackTransaction();
        console.log(error);
        throw new NotFoundException(`Ocurrió un error ${error.message}`);
    
      } finally {
        await queryRunner.release();
      }
    }
    

  /*reportSales() {
    try {

    } catch (error) {
      return `This action returns all sales`;
    }
  }*/

  async findAll({ page, limit }: SaleSearchDto) {
    try {
      page = page ?? 1
      limit = limit ?? 5
      
      console.log({page, limit})
      const [sales, total] = await this.saleRepository.findAndCount({
        where: {
          isActive: true
        },
        relations: { user: true, detailsSale: true },
        order: { id: 'DESC' },
        skip: (page - 1) * limit,
        take: limit,
      });

      const salesWithDetailSale = await Promise.all(sales.map(async (sale) => {
        const detailsSales = await Promise.all(sale.detailsSale.map(async detailSale => {
          const prodDetails = await this.productoRepository.findOne({
            where: {
              id: detailSale.productId
            }
          })

          detailSale.products = prodDetails
          return detailSale
        }))

        sale.detailsSale = detailsSales

        return sale
      }));

      console.log(sales)
      if (sales.length > 0) {
        let totalPag: number = total / limit;
        if (totalPag % 1 != 0) {
          totalPag = Math.trunc(totalPag) + 1;
        }
        let nextPag: number = page >= totalPag ? page : Number(page) + 1
        let prevPag: number = page <= 1 ? page : page - 1;
        return {
          ok: true,
          sales: salesWithDetailSale,
          total,
          totalPag,
          currentPage: Number(page),
          nextPag,
          prevPag,
          message: 'sales found sucessfully',
          status: HttpStatus.OK
        }
      }
    } catch (error) {
      throw new NotFoundException(`Ocurrio un error ${error.message}`)
    }
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} sale`;
  // }

  // update(id: number, updateSaleDto: UpdateSaleDto) {
  //   return `This action updates a #${id} sale`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} sale`;
  // }  

  async report() {
    try {
      
      const sales = await this.saleRepository.find({
        where: { isActive: true },
        relations: { detailsSale: {
          products: true
        }, user: true, }, 
      });
  
      

      const report = sales.map(sale => {
       
        return {
          saleId: sale.id,  
          user: sale.user.name, 
          products: sale.detailsSale.map(detail => ({
            productId: detail.products.name, 
            quantity: detail.quantity,             
          })),
        };
      });
  
      return {
        ok: true,
        report,
        message: 'reporte de ventas',
        status: HttpStatus.OK,
      }; 
    } catch (error) {
      throw new NotFoundException(`Error ${error.message}`);
    }
  } 
  
  /*const reporte = sales.map(sales =>{
    return{
      products: sales.detailsSale.map(detail => ({
        productId: detail.products.name, 
        quantity: detail.quantity,             
      })),
    }
  })

  return {
    ok: true,
    reporte,
    message: 'reporte de ventas',
    status: HttpStatus.OK,
  }; 
} catch (error) {
  throw new NotFoundException(`Error ${error.message}`);
}*/


 /*const filteredDetailsSale = detaislSale.filter((detail) => {
    console.log({date, date1: detail.sales.date })
    return date <= detail.sales.date.toString()

  })*/

  /**El método reduce() en JavaScript es una función 
 * muy poderosa que sirve para acumular o reducir un array a un solo valor. */


async ReporteVentas({date}: DateDto){
  console.log(date)

  //where se puede utilizar para filtrar diferentes propiedades y relaciones, ejemplo: 
  const detaislSale = await this.detailSaleRepository.find({
    where: { sales: { date : date as unknown as Date}, products : {stock: MoreThan(0)},  isActive: true} , 
    relations: { products: true, sales:true}, 
  });
  
 
console.log({});

const reporte = detaislSale.reduce((ventaActual,detail)=>{
  const productId = detail.products.id;
  const productName = detail.products.name;
  const productPrice = detail.products.price;


  if(!ventaActual[productId]){
    ventaActual[productId] = {
      product: productName,
      quantity: 0,
      price: productPrice,
      total: 0,
      date: detail.sales.date,
    };
  }
  
  ventaActual[productId].quantity += detail.quantity;

  ventaActual[productId].total += Number(detail.total)
  return ventaActual

}, {})
const products = Object.values(reporte)
return {
  products
}

}

async portero(){
  const productDetails= await this.detailSaleRepository.find({
    where: {isActive: true},
    relations: {
      products: true
    }
  })

  const acumular = {}



productDetails.forEach(productDetails=>{
  console.log(productDetails);
    const name = productDetails.products.name;

    const saveProduct = acumular[name]

    if(saveProduct) {
      productDetails.quantity+=productDetails.quantity
      return
    }

    acumular[name] = {
      name: productDetails.products.name,
      quantity: productDetails.quantity
    }

  })

  // console.log(acumular)
  // console.log(productDetails)

  if (productDetails.length > 0) {
    return { ok: true, productDetails, status: 200 };
  }

  return { ok: false, message: 'No se encontraron producto', status: 404 };
    } catch (error) {
      return {
        ok: false,
        message: 'Ocurrió un error al obtener los productos',
        status: 500,
      };
    }
  

    /*async ventas({date}: DateDto){
      console.log(date)
      const prueba = await this.detailSaleRepository.find({
        where: {isActive: true, sales: {date: date as unknown as Date}<={date:date as unknown as Date} },
        relations: {products: true, sales:true}
      })

      const listadoVentas = await this.saleRepository.find({
        where: {isActive: true, date:date as unknown as Date },
      })

     const arregloVentas = listadoVentas.map(sales=>sales)
     return arregloVentas
    }*/

     async listado({startDate, endDate}: DateDto) {
      console.log(startDate, endDate);
    
      const listadoVentas = await this.saleRepository.find({
        where: {
          isActive: true,
          date: Between(startDate, endDate),
        },
        relations: {detailsSale:{products:true}}
      });

      
      const sales = listadoVentas.map((sale, i)=>  {
        let objeto: Ganancias;
        const detailsSale = sale.detailsSale;
       for (const saveDetail of detailsSale) {
        const priceProduct = Number(saveDetail.products.price);
        const totalProduct = Number(saveDetail.total);
        const saleCant = Number(saveDetail.quantity);
        const unitCost = Number(saveDetail.products.unitCost);
        
        const prevCosto = objeto?.costoTotalVenta ?? 0
        const prevSum = objeto?.ganancia ?? 0
        const prevcostoTotalCompra = objeto?.costoTotalCompra ?? 0

        const costoTotalCompra =   Number(unitCost) * Number(saleCant) ;
        const costoTotalVenta = Number(saveDetail.total);
        const ganancia = prevSum + (Number(totalProduct) - Number(costoTotalCompra)); 

        objeto = {
          costoTotalVenta: sale.total,
          ganancia: ganancia,
          priceProduct: priceProduct,
          costoTotalCompra: prevcostoTotalCompra + costoTotalCompra
        }
        console.log(costoTotalVenta);
        console.log(ganancia);
       }

       return {
        ...sale,
        ...objeto
       }
      });
      
      return sales;
    }
    }