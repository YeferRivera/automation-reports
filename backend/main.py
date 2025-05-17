from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import files, dashboard

app = FastAPI(
    title="Printer Reports API",
    description="API para procesar archivos de impresoras y generar reportes",
    version="1.0.0"
)

# Configurar CORS para permitir peticiones desde el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # URL del frontend en desarrollo
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir los routers
app.include_router(files.router)
app.include_router(dashboard.router)

@app.get("/")
async def root():
    return {"message": "Bienvenido a la API de Reportes de Impresoras"}