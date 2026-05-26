# IOMS - Import Order Management System

## Frontend

```powershell
cd IOMS\FE
npm install
npm run dev
```

Vite chạy mặc định tại:

```text
http://127.0.0.1:5173
```

Frontend gọi API tại `http://localhost:8080/ioms/api`. Có thể đổi bằng biến môi trường:

```powershell
$env:VITE_API_URL="http://localhost:8080/ioms/api"
npm run dev
```

Khi backend chưa chạy, frontend tự dùng mock data để vẫn hiển thị Dashboard, Orders, Inventory, Profile, Notifications và Settings.

## Backend

Backend là Java Servlet Maven, đóng gói WAR để deploy lên Tomcat 10+.

```powershell
cd IOMS\BE
mvn clean package
```

WAR output:

```text
IOMS\BE\target\ioms.war
```

## Database

Tạo PostgreSQL database tên `ioms`, sau đó chạy schema/seed:

```powershell
psql -U postgres -d ioms -f IOMS\BE\src\main\resources\db\schema.sql
```

Backend đọc cấu hình database từ biến môi trường:

```text
IOMS_DB_URL=jdbc:postgresql://localhost:5432/ioms
IOMS_DB_USER=postgres
IOMS_DB_PASSWORD=postgres
```

Nếu không set, backend dùng các giá trị mặc định ở trên.
