import React, { useState, useEffect } from 'react';
import { CCard, CCardBody, CCardHeader, CForm, CFormInput, CFormLabel, CButton } from '@coreui/react';

const ProductForm = ({ product, onSubmit }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');

  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price);
      setStock(product.stock);
    }
  }, [product]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, price: parseFloat(price), stock: parseInt(stock) });
    setName('');
    setPrice('');
    setStock('');
  };

  return (
    <CCard>
      <CCardHeader>
        <strong>{product ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}</strong>
      </CCardHeader>
      <CCardBody>
        <CForm onSubmit={handleSubmit}>
          <div className="mb-3">
            <CFormLabel htmlFor="productName">Ürün Adı</CFormLabel>
            <CFormInput
              type="text"
              id="productName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <CFormLabel htmlFor="productPrice">Fiyat</CFormLabel>
            <CFormInput
              type="number"
              id="productPrice"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <CFormLabel htmlFor="productStock">Stok</CFormLabel>
            <CFormInput
              type="number"
              id="productStock"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              required
            />
          </div>
          <CButton type="submit" color="primary">
            {product ? 'Güncelle' : 'Ekle'}
          </CButton>
        </CForm>
      </CCardBody>
    </CCard>
  );
};

export default ProductForm;