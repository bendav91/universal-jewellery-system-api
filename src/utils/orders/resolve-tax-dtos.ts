import { TaxDto } from 'src/dtos/taxes/tax.dto';
import { Tax } from 'src/entities/taxes/tax.entity';

export const resolveTaxDtos = (
  taxEntities: Tax[],
): { taxDtos: TaxDto[]; taxMultiplier: number } => {
  let taxMultiplier = 1;

  const taxDtos: TaxDto[] = taxEntities.map((tax) => {
    taxMultiplier += tax.rate;

    return new TaxDto({
      createdAt: tax.createdAt,
      updatedAt: tax.updatedAt,
      deletedAt: tax.deletedAt,
      rate: tax.rate,
      name: tax.name,
      description: tax.description,
    });
  });

  return { taxDtos, taxMultiplier };
};
