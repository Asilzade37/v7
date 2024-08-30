import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { createProduct, checkBarcode } from '../services/api';
import { Card, CardContent, Tabs, Tab, Button, TextField, Grid, IconButton } from '@mui/material';
import { FaBarcode, FaSearch, FaPlusCircle, FaBox, FaWarehouse, FaExclamationTriangle, FaDollarSign, FaPercent, FaTrash } from 'react-icons/fa';
import { useDropzone } from 'react-dropzone';
import '../styles/UrunEkle.scss';
import debounce from 'lodash/debounce';

const UrunEkle = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [barcodeInput, setBarcodeInput] = useState('');
  const [newBarcode, setNewBarcode] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [productImage, setProductImage] = useState(null);

  const [purchasePrice, setPurchasePrice] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [profitMargin, setProfitMargin] = useState('');
  const [lastChangedField, setLastChangedField] = useState(null);

  const warningTimeoutRef = useRef(null);

  const initialValues = {
    barcode: '',
    productName: '',
    remainingStock: '',
    criticalStockAmount: '',
    salePrice: '',
    purchasePrice: '',
    profitMargin: '',
    taxRate: '',
    note: '',
  };

  const validationSchema = Yup.object({
    barcode: Yup.string()
      .min(8, 'En az 8 karakterli olmalı')
      .required('Barkod gereklidir'),
    productName: Yup.string().required('Ürün adı gereklidir'),
    remainingStock: Yup.number().required('Kalan stok gereklidir'),
    criticalStockAmount: Yup.number().required('Kritik stok miktarı gereklidir'),
    salePrice: Yup.number().positive('Satış fiyatı pozitif olmalı').required('Satış fiyatı gereklidir'),
    purchasePrice: Yup.number().positive('Alış fiyatı pozitif olmalı').required('Alış fiyatı gereklidir'),
    profitMargin: Yup.number().min(0, 'Kar oranı pozitif veya sıfır olmalı').required('Kar oranı gereklidir'),
    taxRate: Yup.number().min(0, 'KDV oranı pozitif veya sıfır olmalı').required('KDV oranı gereklidir'),
    note: Yup.string(),
  });

  const showWarning = debounce(() => {
    if (Number(salePrice) < Number(purchasePrice)) {
      toast.error('Satış fiyatı, alış fiyatından düşük olamaz!');
    }
  }, 1000);

  useEffect(() => {
    if (lastChangedField === 'purchasePrice' || lastChangedField === 'profitMargin') {
      if (purchasePrice && profitMargin) {
        const calculatedSalePrice = Number(purchasePrice) * (1 + Number(profitMargin) / 100);
        setSalePrice(calculatedSalePrice.toFixed(2));
      }
    } else if (lastChangedField === 'salePrice') {
      if (purchasePrice && salePrice) {
        const calculatedProfitMargin = ((Number(salePrice) - Number(purchasePrice)) / Number(purchasePrice)) * 100;
        setProfitMargin(calculatedProfitMargin.toFixed(2));
      }
    }

    showWarning();

    return () => {
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
    };
  }, [purchasePrice, salePrice, profitMargin, lastChangedField]);

  const handleInputChange = (e, field, setFieldValue) => {
    const { value } = e.target;
    setLastChangedField(field);
    
    switch (field) {
      case 'purchasePrice':
        setPurchasePrice(value);
        setFieldValue('purchasePrice', value);
        break;
      case 'salePrice':
        setSalePrice(value);
        setFieldValue('salePrice', value);
        break;
      case 'profitMargin':
        setProfitMargin(value);
        setFieldValue('profitMargin', value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setIsLoading(true);
    try {
      const productData = new FormData();
      Object.keys(values).forEach(key => productData.append(key, values[key]));
      if (productImage) {
        productData.append('image', productImage);
      }
      await createProduct(productData);
      toast.success('Ürün başarıyla eklendi');
      resetForm();
      setProductImage(null);
      navigate('/urun-listesi');
    } catch (error) {
      toast.error('Ürün eklenirken bir hata oluştu');
      console.error('Ürün ekleme hatası:', error);
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  const handleBarcodeChange = (e) => {
    setBarcodeInput(e.target.value);
  };

  const handleGetProduct = async (setFieldValue) => {
    if (barcodeInput.length >= 8) {
      try {
        const productData = await checkBarcode(barcodeInput);
        if (productData) {
          setFieldValue('barcode', barcodeInput);
          setFieldValue('productName', productData.productName);
          setFieldValue('remainingStock', productData.remainingStock);
          setFieldValue('criticalStockAmount', productData.criticalStockAmount);
          setFieldValue('salePrice', productData.salePrice.toFixed(2));
          setFieldValue('purchasePrice', productData.purchasePrice);
          setFieldValue('profitMargin', productData.profitMargin.toFixed(2));
          setFieldValue('taxRate', productData.taxRate);
          setFieldValue('note', productData.note);
          if (productData.image) {
            setProductImage(productData.image);
          }
          setPurchasePrice(productData.purchasePrice);
          setSalePrice(productData.salePrice);
          setProfitMargin(productData.profitMargin);
        } else {
          toast.info('Yeni barkod, ürün bilgilerini manuel doldurun');
        }
      } catch (error) {
        console.error('Barkod kontrol hatası:', error);
        toast.error('Barkod kontrolü sırasında bir hata oluştu');
      }
    } else {
      toast.error('Geçerli bir barkod girin (En az 8 karakterli olmalı)');
    }
  };

  const handleNewBarcode = (resetForm) => {
    const generatedBarcode = (Math.random().toString().slice(2, 12)); // 10 karakterli rastgele barkod
    setNewBarcode(generatedBarcode);
    resetForm();
    setBarcodeInput(generatedBarcode);
    setProductImage(null);
    setPurchasePrice('');
    setSalePrice('');
    setProfitMargin('');
    toast.info('Yeni barkod tanımlama moduna geçildi');
  };

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setProductImage(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/*',
    multiple: false
  });

  const handleRemoveImage = () => {
    setProductImage(null);
  };

  return (
    <div className="urun-ekle-container">
      <h2>Yeni Ürün Ekle</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, setFieldValue, resetForm, errors, touched }) => (
          <Form>
            {/* Barkod Alanı */}
            <Card className="barcode-card">
              <CardContent className="barcode-content">
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={8}>
                    <TextField
                      label="Barkod"
                      value={barcodeInput}
                      onChange={handleBarcodeChange}
                      placeholder="Barkodu okutun veya girin"
                      error={touched.barcode && Boolean(errors.barcode)}
                      helperText={touched.barcode && errors.barcode}
                      fullWidth
                      InputProps={{
                        startAdornment: <FaBarcode className="input-icon" />,
                      }}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleGetProduct(setFieldValue)}
                      fullWidth
                      className="get-product-button"
                    >
                      <FaSearch /> Ürünü Getir
                    </Button>
                  </Grid>
                  <Grid item xs={2}>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => handleNewBarcode(resetForm)}
                      fullWidth
                    >
                      <FaPlusCircle /> Yeni Barkod
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Ürün Bilgileri Alanı */}
            <Card className="product-info-card">
              <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
                <Tab label="Ürün Bilgisi" />
                <Tab label="Diğer Bilgiler" />
              </Tabs>
              <CardContent>
                {activeTab === 0 && (
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Field name="productName">
                        {({ field }) => (
                          <TextField
                            {...field}
                            label="Ürün Adı"
                            fullWidth
                            margin="normal"
                            error={touched.productName && Boolean(errors.productName)}
                            helperText={touched.productName && errors.productName}
                            InputProps={{
                              startAdornment: <FaBox className="input-icon" />,
                            }}
                          />
                        )}
                      </Field>
                    </Grid>
                    <Grid item xs={3}>
                      <Field name="remainingStock">
                        {({ field }) => (
                          <TextField
                            {...field}
                            label="Kalan Stok"
                            type="number"
                            fullWidth
                            margin="normal"
                            error={touched.remainingStock && Boolean(errors.remainingStock)}
                            helperText={touched.remainingStock && errors.remainingStock}
                            InputProps={{
                              startAdornment: <FaWarehouse className="input-icon" />,
                            }}
                          />
                        )}
                      </Field>
                    </Grid>
                    <Grid item xs={3}>
                      <Field name="criticalStockAmount">
                        {({ field }) => (
                          <TextField
                            {...field}
                            label="Kritik Stok Miktarı"
                            type="number"
                            fullWidth
                            margin="normal"
                            error={touched.criticalStockAmount && Boolean(errors.criticalStockAmount)}
                            helperText={touched.criticalStockAmount && errors.criticalStockAmount}
                            InputProps={{
                              startAdornment: <FaExclamationTriangle className="input-icon" />,
                            }}
                          />
                        )}
                      </Field>
                    </Grid>
                    <Grid item xs={3}>
                      <Field name="salePrice">
                        {({ field }) => (
                          <TextField
                            {...field}
                            label="Satış Fiyatı"
                            type="number"
                            fullWidth
                            margin="normal"
                            error={touched.salePrice && Boolean(errors.salePrice)}
                            helperText={touched.salePrice && errors.salePrice}
                            InputProps={{
                              startAdornment: <FaDollarSign className="input-icon" />,
                            }}
                            value={salePrice}
                            onChange={(e) => handleInputChange(e, 'salePrice', setFieldValue)}
                          />
                        )}
                      </Field>
                    </Grid>
                    <Grid item xs={3}>
                      <Field name="purchasePrice">
                        {({ field }) => (
                          <TextField
                            {...field}
                            label="Alış Fiyatı"
                            type="number"
                            fullWidth
                            margin="normal"
                            error={touched.purchasePrice && Boolean(errors.purchasePrice)}
                            helperText={touched.purchasePrice && errors.purchasePrice}
                            InputProps={{
                              startAdornment: <FaDollarSign className="input-icon" />,
                            }}
                            value={purchasePrice}
                            onChange={(e) => handleInputChange(e, 'purchasePrice', setFieldValue)}
                          />
                        )}
                      </Field>
                    </Grid>
                    <Grid item xs={3}>
                      <Field name="profitMargin">
                        {({ field }) => (
                          <TextField
                            {...field}
                            label="Kar Oranı %"
                            type="number"
                            fullWidth
                            margin="normal"
                            error={touched.profitMargin && Boolean(errors.profitMargin)}
                            helperText={touched.profitMargin && errors.profitMargin}
                            InputProps={{
                              startAdornment: <FaPercent className="input-icon" />,
                            }}
                            value={profitMargin}
                            onChange={(e) => handleInputChange(e, 'profitMargin', setFieldValue)}
                          />
                        )}
                      </Field>
                    </Grid>
                    <Grid item xs={3}>
                      <Field name="taxRate">
                        {({ field }) => (
                          <TextField
                            {...field}
                            label="KDV Oranı %"
                            type="number"
                            fullWidth
                            margin="normal"
                            error={touched.taxRate && Boolean(errors.taxRate)}
                            helperText={touched.taxRate && errors.taxRate}
                            InputProps={{
                              startAdornment: <FaPercent className="input-icon" />,
                            }}
                          />
                        )}
                      </Field>
                    </Grid>
                  </Grid>
                )}
                {activeTab === 1 && (
                  <Grid container spacing={2}>
                    <Grid item xs={8}>
                      <Field name="note">
                        {({ field }) => (
                          <TextField
                            {...field}
                            label="Ürün Notu"
                            multiline
                            rows={4}
                            fullWidth
                            margin="normal"
                            error={touched.note && Boolean(errors.note)}
                            helperText={touched.note && errors.note}
                          />
                        )}
                      </Field>
                    </Grid>
                    <Grid item xs={4}>
                      <div className="image-upload-container">
                        <h3>Ürün Resmi Yükle</h3>
                        <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
                          <input {...getInputProps()} />
                          {isDragActive ? (
                            <p>Resmi buraya bırakın...</p>
                          ) : (
                            <p>Resmi buraya sürükleyin veya tıklayarak seçin</p>
                          )}
                        </div>
                        {productImage && (
                          <div className="image-preview">
                            <img
                              src={URL.createObjectURL(productImage)}
                              alt="Ürün önizleme"
                              style={{ maxWidth: '100%', maxHeight: '200px' }}
                            />
                            <IconButton onClick={handleRemoveImage} className="remove-image">
                              <FaTrash />
                            </IconButton>
                          </div>
                        )}
                      </div>
                    </Grid>
                  </Grid>
                )}
              </CardContent>
            </Card>

            {/* Gönder Butonu */}
            <Button type="submit" variant="contained" color="primary" disabled={isSubmitting || isLoading}>
              {isLoading ? 'Ekleniyor...' : 'Ürünü Ekle'}
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default UrunEkle;