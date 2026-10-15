# Personal Portfolio

Ứng dụng portfolio cá nhân full-stack để giới thiệu hồ sơ, hành trình học tập, công nghệ, dự án và tiếp nhận liên hệ. Dự án hiện hoàn thành phần lớn giao diện trang chủ và nền tảng dữ liệu Contact; các API, dữ liệu động và khu quản trị vẫn chưa hoàn chỉnh.

## Công nghệ

| Phần | Công nghệ |
| --- | --- |
| Frontend | Angular 22, TypeScript, SCSS, Angular Router, Reactive Forms |
| Backend | ASP.NET Core Web API, C#, .NET 10 |
| Database | MySQL |
| ORM | Entity Framework Core 10, `MySql.EntityFrameworkCore` |
| Công cụ | npm, Angular CLI, .NET CLI, Git |

## Cấu trúc dự án

```text
personal-portfolio/
├── README.md
├── frontend/                              # Ứng dụng Angular
│   ├── public/
│   │   ├── images/avatar.jpg              # Ảnh đại diện
│   │   └── icons/tech/                    # Icon công nghệ
│   └── src/
│       ├── app/
│       │   ├── app.ts / app.html          # Root component, khung layout
│       │   ├── app.config.ts              # Provider toàn cục
│       │   ├── app.routes.ts              # Route của ứng dụng
│       │   ├── features/home/
│       │   │   ├── pages/home/            # Trang Home, ghép các section
│       │   │   └── components/            # Intro, Journey, TechStack,
│       │   │                              # FeaturedProjects, Contact
│       │   └── shared/
│       │       ├── components/project-card/ # Card dự án tái sử dụng
│       │       └── layout/                  # Navbar và Footer
│       └── styles.scss                    # Style toàn cục
└── backend/
    ├── PersonalPortfolio.sln
    └── src/PersonalPortfolio.Api/
        ├── Program.cs                     # DI và HTTP pipeline
        ├── Data/ApplicationDbContext.cs   # EF Core DbContext
        └── Contact/
            ├── Entities/                  # ContactMessage và trạng thái
            ├── Repositories/              # Interface/repository EF Core
            └── ContactMessageConfiguration.cs # EF Core mapping
```

## Kiến trúc hiện tại

```text
Angular Home UI ─────► [chưa gọi HTTP API]

ASP.NET Core API
Program.cs → ApplicationDbContext → MySQL
                  ▲
          ContactRepository
```

Backend hiện chỉ có entity, EF mapping và repository của Contact. Không có controller, DTO, service hoặc endpoint Contact trong source hiện tại. Vì vậy form liên hệ chỉ kiểm tra dữ liệu ở trình duyệt; nút gửi đang bị vô hiệu hóa và chưa lưu dữ liệu.

## Phần đã làm

### Frontend

| Hạng mục | Trạng thái | Chi tiết |
| --- | --- | --- |
| Khung ứng dụng | Hoàn thành | `App` hiển thị Navbar, `router-outlet` và Footer. |
| Route Home | Hoàn thành cơ bản | Route `/` hiển thị `Home`; chưa có route riêng cho Projects, Blog, Admin. |
| Intro | Hoàn thành giao diện | Có avatar, tên, chức danh, mô tả và GitHub. LinkedIn đang trống. |
| Journey | Hoàn thành giao diện | Timeline dùng dữ liệu tĩnh về học tập/dự án. |
| Tech Stack | Hoàn thành giao diện | Hiển thị Frontend, Backend, Database, Tools cùng icon trong `public`. |
| Featured Projects | Hoàn thành khung | Có `ProjectCard` tái sử dụng và một dự án mẫu; ảnh, GitHub URL, demo URL đang trống. |
| Contact form | Hoàn thành một phần | Reactive Forms: tên bắt buộc, tối thiểu 2 ký tự; email hợp lệ; message bắt buộc, tối thiểu 10 ký tự. |
| Navbar | Hoàn thành một phần | Brand/Home hoạt động. Projects, Blog, Contact đang disabled; chưa scroll/chuyển trang. |
| Kiểm thử | Khung có sẵn | Có file `*.spec.ts` mặc định, chưa thấy test nghiệp vụ/UI đáng kể. |

### Backend

| Hạng mục | Trạng thái | Chi tiết |
| --- | --- | --- |
| API nền tảng | Hoàn thành cơ bản | Project .NET 10 có HTTPS redirection, controller routing và authorization middleware. |
| MySQL/EF Core | Đã cấu hình trong mã | `ApplicationDbContext` dùng `UseMySQL` và cần `ConnectionStrings:DefaultConnection`. |
| Contact entity | Hoàn thành | `ContactMessage`: `Id`, `Name`, `Email`, `Message`, `Status`, `CreatedAt`, `UpdatedAt`. |
| Trạng thái Contact | Hoàn thành | `Unread`, `Read`, `Archived`. |
| EF mapping | Hoàn thành | Bảng `contact_messages`, ràng buộc độ dài/kiểu cột, index `(Status, CreatedAt)`. |
| Repository | Hoàn thành cơ bản | `AddAsync` và `SaveChangesAsync`, có `CancellationToken`. |
| Migration | Chưa có | Chưa có thư mục/file EF Core migrations. |
| Contact API | Chưa có | Chưa có controller, DTO, validation server-side, service hoặc `POST` endpoint. |
| API nội dung portfolio | Chưa có | Chưa có API cho Profile, Skills, Journey, Projects, Blog. |
| Authentication/authorization | Chưa có | Chưa cấu hình auth scheme; `UseAuthorization()` hiện chưa bảo vệ endpoint nào. |
| Tài liệu API | Chưa có | Chưa thấy Swagger/OpenAPI. |

## Luồng Contact cần hoàn thiện

```text
Người dùng nhập form
  → Angular validation + POST /api/contact-messages
  → Controller kiểm tra request DTO
  → Service tạo ContactMessage (Unread, thời gian UTC)
  → Repository/EF Core lưu MySQL
  → API trả response
  → Angular hiện loading, thành công/lỗi và reset form khi phù hợp
```

Nên dùng DTO riêng cho request/response, không trả trực tiếp entity database; đồng thời validation phải có ở cả frontend và backend.

## Việc cần làm để hoàn thiện

### Ưu tiên 1 — Contact hoạt động end-to-end

1. Tạo request/response DTO và validation server-side cho tên, email, nội dung.
2. Tạo `ContactService` chứa nghiệp vụ tạo message; controller chỉ xử lý HTTP.
3. Tạo `ContactMessagesController` với `POST /api/contact-messages`.
4. Cấu hình connection string bằng User Secrets/biến môi trường, không commit mật khẩu.
5. Tạo/apply EF Core migration cho `contact_messages`.
6. Thêm CORS đúng origin của frontend.
7. Thêm `provideHttpClient()`, Angular API service, `(ngSubmit)`, trạng thái loading/success/error và disable submit khi đang gửi hoặc form lỗi.
8. Test các trường hợp hợp lệ, input sai, database lỗi và request bị hủy.

### Ưu tiên 2 — Hoàn chỉnh website public

1. Thay dữ liệu mẫu bằng thông tin, dự án, ảnh và liên kết thật.
2. Quyết định dữ liệu nào tĩnh ở frontend, dữ liệu nào quản lý qua API.
3. Làm trang/section chi tiết Projects; triển khai Blog nếu trong phạm vi.
4. Hoàn thiện navbar bằng route hoặc anchor scroll, bao gồm trạng thái active.
5. Rà soát responsive và accessibility: keyboard focus, nhãn form, alt text.
6. Thêm SEO: title, meta description, Open Graph, sitemap/robots khi deploy public.

### Ưu tiên 3 — Admin, chất lượng và triển khai

1. Thiết kế authentication/authorization cho Admin.
2. Xây API và Admin UI để xem/lọc/đánh dấu Contact; CRUD dự án, kỹ năng, hành trình, bài viết.
3. Bổ sung global error handling, logging, rate limiting/chống spam cho Contact API.
4. Viết unit/integration test backend và component/service test frontend.
5. Thiết lập CI build/test, cấu hình production và quy trình deploy frontend, API, MySQL.

## Chạy cục bộ

### Yêu cầu

- Node.js/npm (package manager khai báo: npm 11.19.0)
- .NET SDK 10
- MySQL nếu chạy backend với database thật

### Frontend

```bash
cd frontend
npm install
npm start
```

```bash
cd frontend
npm run build
npm test
```

### Backend

Đặt `ConnectionStrings:DefaultConnection` bằng User Secrets hoặc biến môi trường trước khi chạy. Ví dụ local (thay giá trị mẫu):

```bash
cd backend/src/PersonalPortfolio.Api
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "server=localhost;port=3306;database=personal_portfolio;user=YOUR_USER;password=YOUR_PASSWORD"
cd ../../..
dotnet run --project src/PersonalPortfolio.Api
```

```bash
cd backend
dotnet build PersonalPortfolio.sln --no-restore
```

> Backend chạy được không có nghĩa Contact đã hoạt động: hiện chưa có migration hay Contact endpoint.

## Quy ước bảo mật

- Không commit mật khẩu, connection string thật, token hoặc API key vào `appsettings*.json`.
- Dùng migration để quản lý thay đổi schema; có backup trước thay đổi production.
- Luôn validate input ở server, kể cả khi frontend đã validation.
- Chỉ mở CORS cho domain/method/header cần thiết ở production.
- Không commit `bin/`, `obj/`, `node_modules/` hay cấu hình bí mật; nên có `.gitignore` phù hợp.

## Tình trạng sẵn sàng

| Mục tiêu | Mức sẵn sàng |
| --- | --- |
| Demo giao diện portfolio một trang | Có thể dùng sau khi điền nội dung/liên kết thật |
| Form liên hệ thực tế | Chưa sẵn sàng |
| Portfolio dùng dữ liệu động | Chưa sẵn sàng |
| Khu vực Admin | Chưa triển khai |
| Production deployment | Chưa sẵn sàng; cần hoàn tất bảo mật, test, migration và cấu hình môi trường |
