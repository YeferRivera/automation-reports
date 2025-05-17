import openpyxl

class BusinessUnitExtractor:
    @staticmethod
    def extract_from_excel(invoice_path):
        """Extrae las unidades de negocio del archivo Excel de facturas"""
        wb_factura = openpyxl.load_workbook(invoice_path, data_only=True)
        ws_factura = wb_factura.active
        
        # Lista para almacenar todas las unidades de negocio encontradas
        unidades_negocio = []
        
        # Identificar unidades de negocio en celdas combinadas
        for merged_range in ws_factura.merged_cells.ranges:
            min_col, min_row, max_col, max_row = merged_range.bounds
            # Celdas combinadas que abarcan columnas C y D
            if min_col == 3 and max_col == 4:
                cell_value = ws_factura.cell(row=min_row, column=min_col).value
                if cell_value and isinstance(cell_value, str) and len(cell_value.strip()) > 0:
                    unidades_negocio.append({
                        'nombre': cell_value.strip(),
                        'fila': min_row
                    })
        
        # Ordenar unidades de negocio por número de fila
        unidades_negocio.sort(key=lambda x: x['fila'])
        return unidades_negocio