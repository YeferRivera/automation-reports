import pandas as pd
import openpyxl

# === 1. Cargar archivo resumen ya generado ===
resumen_path = "resumen_dinamico_formateado.xlsx"
resumen_df = pd.read_excel(resumen_path)

# === 2. Cargar archivo de factura y tomar columnas por posición ===
factura_df = pd.read_excel("factura_enero.xlsx", header=None)

# Columna E (índice 4): Número de Serie
# Columna M (índice 12): Pag. Saca (contador real)
factura_data = factura_df[[4, 12]]
factura_data.columns = ['Número de Serie de la Impresora', 'Factura']

# Eliminar filas vacías o sin número de serie
factura_data = factura_data.dropna(subset=['Número de Serie de la Impresora'])

# === 3. Cruce por Número de Serie de la Impresora ===
resumen_final = pd.merge(
    resumen_df,
    factura_data,
    on='Número de Serie de la Impresora',
    how='left'  # Mantener todo lo del resumen aunque falte en factura
)

# === 4. Guardar con nueva columna ===
output_path = "resumen_con_factura.xlsx"
resumen_final.to_excel(output_path, index=False)

# (Opcional) Aplicar formato adicional si deseas continuar con estilos
