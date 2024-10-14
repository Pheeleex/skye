import { NextApiRequest, NextApiResponse } from 'next';
import { getProducts } from '@/lib/actions/products.actions';
import { FilterProps } from '@/types/firebasetypes';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { skinType, skinConcern, category, limit, lastVisible } = req.query;

  const filters: FilterProps = {
    skinType: skinType as SkinType|| '',
    skinConcern: skinConcern as string || '',
    category: category as string || '',
    limit: limit ? parseInt(limit as string) : 10, // Convert limit to a number
  };

  try {
    const { product, lastVisible: newLastVisible } = await getProducts(filters, lastVisible);
    res.status(200).json({ product, lastVisible: newLastVisible });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
}
