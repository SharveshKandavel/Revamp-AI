# Revamp AI - FastAPI Backend

This backend service handles data synchronization between the Amazon Rainforest API and the Supabase database.

## Setup

1.  **Install Python 3.9+**
2.  **Navigate to the backend directory**:
    ```bash
    cd backend
    ```
3.  **Create a virtual environment**:
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```
4.  **Install dependencies**:
    ```bash
    pip install -r requirements.txt
    ```
5.  **Configure Environment Variables**:
    Create a `.env` file in the `backend` directory (or ensure the root `.env` is accessible) with the following:
    ```env
    VITE_SUPABASE_URL=your_supabase_url
    SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
    RAINFOREST_API_KEY=your_rainforest_api_key
    ```

## Running the Server

```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`.

## Endpoints

- `GET /`: Root message.
- `GET /health`: Health check.
- `POST /sync/{category}/{asin}`: Triggers a background sync of an Amazon product into the Supabase database.
