import { useEffect, useReducer, useState } from 'react';
import axios from 'axios';
import Product from '../Components/Product';
import logger from 'use-reducer-logger';
import LoadingBox from '../Components/LoadingBox';
import MessageBox from '../Components/MessageBox';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, products: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function HomeScreen() {
  const [{ loading, error, products }, dispatch] = useReducer(logger(reducer), {
    products: [],
    loading: true,
    error: '',
  });

  //   const [products, setProducts] = useState([]);

  const fetchData = async () => {
    dispatch({ type: 'FETCH_REQUEST' });
    try {
      const result = await axios.get('/api/products');
      dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
    } catch (error) {
      dispatch({ type: 'FETCH_FAIL', payload: error.message });
    }
    // setProducts(result.data);
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div>
      <h1>Popular Products</h1>
      <div className="products">
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          products.map((product) => (
            <Product key={product.slug} product={product} />
          ))
        )}
      </div>
    </div>
  );
}
export default HomeScreen;
