/**
 * Ürün resmini kaldırır.
 * @param {Function} setProductImage - Ürün resmini güncelleyen state setter fonksiyonu
 */
export function handleRemoveImage(setProductImage) {
    return () => {
      setProductImage(null);
    };
  }