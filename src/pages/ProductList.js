import React from 'react';
import { CCard, CCardBody, CCardHeader, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CButton } from '@coreui/react';
import { cilPencil, cilTrash } from '@coreui/icons';
import CIcon from '@coreui/icons-react';

const ProductList = ({ products, onEdit, onDelete }) => {
  return (
    <CCard>
      <CCardHeader>
        <strong>Ürün Listesi</strong>
      </CCardHeader>
      <CCardBody>
        <CTable hover bordered>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>Ürün Adı</CTableHeaderCell>
              <CTableHeaderCell>Fiyat</CTableHeaderCell>
              <CTableHeaderCell>Stok</CTableHeaderCell>
              <CTableHeaderCell>İşlemler</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {products.map((product) => (
              <CTableRow key={product.id}>
                <CTableDataCell>{product.name}</CTableDataCell>
                <CTableDataCell>{product.price} TL</CTableDataCell>
                <CTableDataCell>{product.stock}</CTableDataCell>
                <CTableDataCell>
                  <CButton color="primary" size="sm" className="me-2" onClick={() => onEdit(product)}>
                    <CIcon icon={cilPencil} /> Düzenle
                  </CButton>
                  <CButton color="danger" size="sm" onClick={() => onDelete(product.id)}>
                    <CIcon icon={cilTrash} /> Sil
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </CCardBody>
    </CCard>
  );
};

export default ProductList;