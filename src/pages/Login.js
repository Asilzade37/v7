import React, { useContext } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { UserContext } from '../contexts/UserContext';
import { login } from '../services/api';
import '../styles/Login.scss';

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Geçerli bir e-posta adresi girin')
    .required('E-posta gerekli'),
  password: Yup.string().required('Şifre gerekli'),
});

const Login = () => {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  return (
    <div className="login">
      <h1>Giriş Yap</h1>
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={LoginSchema}
        onSubmit={async (values, { setSubmitting, setFieldError }) => {
          try {
            const response = await login(values);
            console.log('Giriş başarılı:', response.data);
            localStorage.setItem('token', response.data.token);
            setUser(response.data.user);
            toast.success('Giriş başarılı. Yönlendiriliyorsunuz...', {
              autoClose: 300,
              onClose: () => navigate('/dashboard'),
            });
          } catch (error) {
            console.error('Giriş hatası:', error);
            setFieldError('email', 'Geçersiz e-posta veya şifre');
            toast.error('Geçersiz e-posta veya şifre', { autoClose: 3000 });
          }
          setSubmitting(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="form-group">
              <label htmlFor="email">E-posta</label>
              <Field type="email" name="email" />
              <ErrorMessage name="email" component="div" className="error" />
            </div>

            <div className="form-group">
              <label htmlFor="password">Şifre</label>
              <Field type="password" name="password" />
              <ErrorMessage name="password" component="div" className="error" />
            </div>

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Login;