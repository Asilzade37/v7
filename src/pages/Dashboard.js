import React, { useState } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CRow,
  CCol,
  CWidgetStatsA,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CFormSelect,
  CInputGroup,
  CInputGroupText,
  CFormInput
} from '@coreui/react';
import { CChartLine } from '@coreui/react-chartjs';
import CIcon from '@coreui/icons-react';
import { cilArrowTop, cilArrowBottom, cilOptions } from '@coreui/icons';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { logout } from '../services/api';
import { toast } from 'react-toastify';
import '../styles/Dashboard.scss';

const Dashboard = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [sortColumn, setSortColumn] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [pageSize, setPageSize] = useState(25);
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogout = () => {
    logout();
    setUser(null);
    toast.success('Çıkış yapıldı', { autoClose: 3000 });
    navigate('/login');
  };

  const handleSort = (column) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const demoData = [
    { id: 1, saleCode: 'S001', customerName: 'Ahmet Yılmaz', totalProducts: 3, totalAmount: 1500, discount: 50, paymentType: 'Kredi Kartı', dateTime: '2023-08-01 14:30', employee: 'Mehmet Demir' },
    { id: 2, saleCode: 'S002', customerName: 'Ayşe Kaya', totalProducts: 2, totalAmount: 750, discount: 0, paymentType: 'Nakit', dateTime: '2023-08-02 10:15', employee: 'Fatma Yıldız' },
    { id: 3, saleCode: 'S003', customerName: 'Ali Öz', totalProducts: 5, totalAmount: 2200, discount: 100, paymentType: 'Havale', dateTime: '2023-08-03 16:45', employee: 'Can Demir' },
    // Daha fazla örnek veri ekleyin...
  ];

  const filteredData = demoData.filter(item =>
    Object.values(item).some(val => 
      val.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const sortedData = [...filteredData].sort((a, b) => {
    if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <button onClick={handleLogout} className="logout-button">Çıkış Yap</button>
      </div>
      
      <CRow>
        {[
          { title: 'Günlük Satış Adeti', value: '150', color: 'primary', percentage: 12.5 },
          { title: 'Günlük Tutar', value: '15,000 TL', color: 'info', percentage: 8.2 },
          { title: 'Aylık Satış Adeti', value: '3,500', color: 'warning', percentage: 3.7 },
          { title: 'Aylık Tutar', value: '350,000 TL', color: 'danger', percentage: 5.1 }
        ].map((widget, index) => (
          <CCol sm={6} lg={3} key={index}>
            <CWidgetStatsA
              className="mb-4"
              color={widget.color}
              value={
                <>
                  {widget.value}{' '}
                  <span className="fs-6 fw-normal">
                    ({widget.percentage}% <CIcon icon={widget.percentage > 0 ? cilArrowTop : cilArrowBottom} />)
                  </span>
                </>
              }
              title={widget.title}
              action={
                <CIcon icon={cilOptions} className="text-high-emphasis-inverse" />
              }
              chart={
                <CChartLine
                  className="mt-3 mx-3"
                  style={{ height: '70px' }}
                  data={{
                    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                    datasets: [
                      {
                        label: widget.title,
                        backgroundColor: 'transparent',
                        borderColor: 'rgba(255,255,255,.55)',
                        pointBackgroundColor: 'rgba(255,255,255,.55)',
                        data: [65, 59, 84, 84, 51, 55, 40],
                      },
                    ],
                  }}
                  options={{
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                    maintainAspectRatio: false,
                    scales: {
                      x: {
                        grid: {
                          display: false,
                          drawBorder: false,
                        },
                        ticks: {
                          display: false,
                        },
                      },
                      y: {
                        min: 30,
                        max: 89,
                        display: false,
                        grid: {
                          display: false,
                        },
                        ticks: {
                          display: false,
                        },
                      },
                    },
                    elements: {
                      line: {
                        borderWidth: 1,
                        tension: 0.4,
                      },
                      point: {
                        radius: 4,
                        hitRadius: 10,
                        hoverRadius: 4,
                      },
                    },
                  }}
                />
              }
            />
          </CCol>
        ))}
      </CRow>

      <CCard className="mb-4">
        <CCardHeader>
          <strong>Son Satışlar</strong>
        </CCardHeader>
        <CCardBody>
          <div className="d-flex justify-content-between mb-3">
            <CFormSelect
              className="w-auto"
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
            >
              <option value="25">25 kayıt göster</option>
              <option value="50">50 kayıt göster</option>
              <option value="100">100 kayıt göster</option>
            </CFormSelect>
            <CInputGroup className="w-auto">
              <CInputGroupText>Ara</CInputGroupText>
              <CFormInput
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </CInputGroup>
          </div>
          <CTable hover responsive>
            <CTableHead>
              <CTableRow>
                {['Sıra', 'Satış Kodu', 'Müşteri İsmi', 'Toplam Ürün', 'Toplam Tutar', 'İskonto', 'Ödeme Tipi', 'Tarih Saat', 'Personel'].map((header) => (
                  <CTableHeaderCell
                    key={header}
                    onClick={() => handleSort(header.toLowerCase().replace(' ', ''))}
                    style={{ cursor: 'pointer' }}
                  >
                    {header} {sortColumn === header.toLowerCase().replace(' ', '') && (sortDirection === 'asc' ? '▲' : '▼')}
                  </CTableHeaderCell>
                ))}
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {sortedData.slice(0, pageSize).map((item, index) => (
                <CTableRow key={item.id}>
                  <CTableDataCell>{index + 1}</CTableDataCell>
                  <CTableDataCell>{item.saleCode}</CTableDataCell>
                  <CTableDataCell>{item.customerName}</CTableDataCell>
                  <CTableDataCell>{item.totalProducts}</CTableDataCell>
                  <CTableDataCell>{item.totalAmount} TL</CTableDataCell>
                  <CTableDataCell>{item.discount} TL</CTableDataCell>
                  <CTableDataCell>{item.paymentType}</CTableDataCell>
                  <CTableDataCell>{item.dateTime}</CTableDataCell>
                  <CTableDataCell>{item.employee}</CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default Dashboard;