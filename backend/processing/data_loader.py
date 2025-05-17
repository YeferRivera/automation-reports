import pandas as pd

class DataLoader:
    @staticmethod
    def load_master_data(file_path):
        """Carga los datos del archivo maestro CSV"""
        return pd.read_csv(file_path, sep=";", encoding="ISO-8859-1", low_memory=False)
    
    @staticmethod
    def load_invoice_data(file_path):
        """Carga los datos de factura desde Excel"""
        factura_df = pd.read_excel(file_path, header=None)
        
        # Crear DataFrame con columnas específicas
        factura_data = pd.DataFrame()
        factura_data['Número de Serie'] = factura_df.iloc[:, 4]  # Columna E
        factura_data['Factura'] = factura_df.iloc[:, 12]  # Columna M
        factura_data['Ciudad'] = factura_df.iloc[:, 6]    # Columna G
        factura_data['Ubicación'] = factura_df.iloc[:, 8]  # Columna I
        factura_data['fila'] = factura_data.index + 1
        
        # Eliminar filas sin número de serie
        return factura_data.dropna(subset=['Número de Serie'])