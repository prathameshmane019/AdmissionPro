// import db from '../../utils/db'; // Import your database connection
// import { Product } from '../../models/Product'; // Import your Product model

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { query } = req.query;
    const products = await searchProducts(query);

    res.status(200).json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

async function searchProducts(query) {
  try {
    await db.connect();

    const products = await Product.find({ name: { $regex: query, $options: 'i' } });

    await db.disconnect();

    return products;
  } catch (error) {
    console.error('Error searching products:', error);
    throw new Error('Error searching products');
  }
}
