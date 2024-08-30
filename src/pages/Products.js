import React, { useState, useEffect } from 'react';
import { CRow, CCol, CButton } from '@coreui/react';
import ProductList from './ProductList';
import ProductForm from './ProductForm';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../services/api';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await getProducts();
      setProducts(response.data);
    } catch (error) {
      console.error('Ürünler yüklenirken hata oluştu:', error);
    }
  };

  const handleCreate = async (product) => {
    try {
      await createProduct(product);
      fetchProducts();
      setIsFormVisible(false);
    } catch (error) {
      console.error('Ürün oluşturulurken hata oluştu:', error);
    }
  };

  const handleUpdate = async (product) => {
    try {
      await updateProduct(selectedProduct.id, product);
      fetchProducts();
      setSelectedProduct(null);
      setIsFormVisible(false);
    } catch (error) {
      console.error('Ürün güncellenirken hata oluştu:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      fetchProducts();
    } catch (error) {
      console.error('Ürün silinirken hata oluştu:', error);
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setIsFormVisible(true);
  };

  return (
    <div className="products">
      <CRow>
        <CCol>
          <h1>Ürün Yönetimi</h1>
          <CButton 
            color="primary" 
            onClick={() => {
              setSelectedProduct(null);
              setIsFormVisible(true);
            }}
          >
            Yeni Ürün Ekle
          </CButton>
        </CCol>
      </CRow>
      <CRow className="mt-3">
        <CCol md={isFormVisible ? 8 : 12}>
          <ProductList 
            products={products} 
            onEdit={handleEdit} 
            onDelete={handleDelete} 
          />
        </CCol>
        {isFormVisible && (
          <CCol md={4}>
            <ProductForm 
              product={selectedProduct} 
              onSubmit={selectedProduct ? handleUpdate : handleCreate} 
            />
          </CCol>
        )}
      </CRow>
    </div>
  );
};

export default Products;