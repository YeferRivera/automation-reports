from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
import shutil
import os
import uuid
from tempfile import NamedTemporaryFile
from typing import List
from processing.data_loader import DataLoader
from processing.business_units import BusinessUnitExtractor
from processing.data_processor import DataProcessor
from processing.report_generator import ReportGenerator

router = APIRouter(prefix="/files", tags=["files"])

# Directorio para archivos temporales
TEMP_DIR = "temp"
os.makedirs(TEMP_DIR, exist_ok=True)

# Almacenamiento en memoria de resultados procesados para el dashboard
processed_results = {}

@router.post("/upload/")
async def upload_files(
    background_tasks: BackgroundTasks,
    master_file: UploadFile = File(...),
    invoice_file: UploadFile = File(...)
):
    # Generar ID único para este procesamiento
    process_id = str(uuid.uuid4())
    
    # Crear directorios para este proceso
    process_dir = os.path.join(TEMP_DIR, process_id)
    os.makedirs(process_dir, exist_ok=True)
    
    # Guardar archivos recibidos
    master_path = os.path.join(process_dir, "MAESTRO_ENERO.csv")
    invoice_path = os.path.join(process_dir, "factura_enero.xlsx")
    
    try:
        # Guardar los archivos
        with open(master_path, "wb") as buffer:
            shutil.copyfileobj(master_file.file, buffer)
        
        with open(invoice_path, "wb") as buffer:
            shutil.copyfileobj(invoice_file.file, buffer)
        
        # Procesar en segundo plano
        background_tasks.add_task(
            process_files,
            process_id,
            master_path,
            invoice_path
        )
        
        return {"process_id": process_id, "message": "Archivos recibidos, procesamiento iniciado"}
    
    except Exception as e:
        # Limpiar en caso de error
        shutil.rmtree(process_dir, ignore_errors=True)
        raise HTTPException(status_code=500, detail=f"Error al procesar archivos: {str(e)}")

def process_files(process_id: str, master_path: str, invoice_path: str):
    """Procesa los archivos y guarda los resultados"""
    try:
        process_dir = os.path.join(TEMP_DIR, process_id)
        output_path = os.path.join(process_dir, "resume.xlsx")
        
        # Cargar datos
        maestro_df = DataLoader.load_master_data(master_path)
        factura_data = DataLoader.load_invoice_data(invoice_path)
        
        # Extraer unidades de negocio
        unidades_negocio = BusinessUnitExtractor.extract_from_excel(invoice_path)
        
        # Procesar datos
        processor = DataProcessor()
        processor.assign_business_units(factura_data, unidades_negocio)
        resumen_data = processor.process_data(maestro_df, factura_data)
        
        # Generar reporte
        report_gen = ReportGenerator()
        report_gen.generate_summary_report(resumen_data, output_path)
        
        # Guardar datos para dashboard
        processed_results[process_id] = {
            "resumen_data": resumen_data,
            "unidades_negocio": unidades_negocio,
            "series_por_unidad": processor.get_series_por_unidad(),
            "output_path": output_path
        }
        
    except Exception as e:
        # Registrar error
        print(f"Error en el procesamiento: {str(e)}")
        processed_results[process_id] = {"error": str(e)}

@router.get("/status/{process_id}")
async def get_process_status(process_id: str):
    """Verifica el estado del procesamiento"""
    if process_id not in processed_results:
        return {"status": "pending", "message": "Procesamiento en curso o no iniciado"}
    
    result = processed_results[process_id]
    if "error" in result:
        return {"status": "error", "message": result["error"]}
    
    return {"status": "completed", "message": "Procesamiento completado"}

@router.get("/download/{process_id}")
async def download_report(process_id: str):
    """Descarga el reporte generado"""
    if process_id not in processed_results or "output_path" not in processed_results[process_id]:
        raise HTTPException(status_code=404, detail="Reporte no encontrado")
    
    output_path = processed_results[process_id]["output_path"]
    
    if not os.path.exists(output_path):
        raise HTTPException(status_code=404, detail="Archivo de reporte no encontrado")
    
    return FileResponse(
        path=output_path,
        filename="reporte_impresoras.xlsx",
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )

@router.get("/cleanup/{process_id}")
async def cleanup_files(process_id: str):
    """Limpia los archivos temporales"""
    process_dir = os.path.join(TEMP_DIR, process_id)
    
    if os.path.exists(process_dir):
        shutil.rmtree(process_dir, ignore_errors=True)
    
    if process_id in processed_results:
        del processed_results[process_id]
    
    return {"message": "Recursos liberados correctamente"}