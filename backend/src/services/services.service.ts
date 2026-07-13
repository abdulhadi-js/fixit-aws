import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceCategory } from './service-category.entity';
import { CreateServiceDto, UpdateServiceDto } from './dto/service.dto';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(ServiceCategory)
    private readonly serviceRepo: Repository<ServiceCategory>,
  ) {}

  async onModuleInit() {
    // Seed essential services for testing/frontend fallback if they don't exist
    const defaultServices = [
      {
        id: '43dc8fe1-2ffa-42a8-8afa-6a15a393ee6a',
        title: 'Deep Home Cleaning',
        base_price: 3000,
        estimated_duration_mins: 120,
      },
      {
        id: 'CUSTOM', // Just in case they send 'CUSTOM' instead of a UUID, though schema expects UUID, we'll only seed the UUID one for now.
        title: 'Custom Job',
        base_price: 1000,
        estimated_duration_mins: 60,
      }
    ];

    try {
      const count = await this.serviceRepo.count();
      if (count === 0) {
        // We only seed the valid UUID one to avoid DB cast errors on the ID column
        await this.serviceRepo.save({
          id: '43dc8fe1-2ffa-42a8-8afa-6a15a393ee6a',
          title: 'Deep Home Cleaning',
          base_price: 3000,
          estimated_duration_mins: 120,
        });
        console.log('🌱 Seeded default services successfully.');
      }
    } catch (error) {
      console.error('Failed to seed services:', error);
    }
  }

  findAll(): Promise<ServiceCategory[]> {
    return this.serviceRepo.find();
  }

  async findOne(id: string): Promise<ServiceCategory> {
    const service = await this.serviceRepo.findOne({ where: { id } });
    if (!service) throw new NotFoundException(`Service ${id} not found`);
    return service;
  }

  create(dto: CreateServiceDto): Promise<ServiceCategory> {
    const service = this.serviceRepo.create(dto);
    return this.serviceRepo.save(service);
  }

  async update(id: string, dto: UpdateServiceDto): Promise<ServiceCategory> {
    await this.findOne(id); // throws if not found
    await this.serviceRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<{ message: string }> {
    await this.findOne(id);
    await this.serviceRepo.delete(id);
    return { message: `Service ${id} deleted` };
  }
}
