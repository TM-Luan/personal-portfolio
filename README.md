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

Contact đã chạy xuyên suốt từ form Angular tới API: form gọi endpoint `POST /api/contact-messages`, API kiểm tra request, service tạo message và repository lưu qua EF Core. Backend vẫn cần một MySQL được cấu hình và migration được áp dụng trước khi có thể lưu dữ liệu thật.

Frontend gọi bằng đường dẫn tương đối `/api/contact-messages`. Khi phát triển, `frontend/proxy.conf.json` chuyển tiếp `/api` đến `http://localhost:5243`; khi production, web server/reverse proxy cần chuyển tiếp cùng đường dẫn này tới backend.

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
| Contact form | Hoàn thành | Reactive Forms validation đúng giới hạn API, submit HTTP, trạng thái đang gửi/thành công/lỗi và reset form sau khi gửi thành công. |
| Navbar | Hoàn thành cơ bản | Brand/Home hoạt động; Projects, Journey và Contact cuộn tới section tương ứng. Blog chưa triển khai. |
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
| Migration | Đã tạo, chưa áp dụng | Migration `InitialCreate` tạo bảng `contact_messages`; cần chạy `database update` trên MySQL đã cấu hình. |
| Contact API | Hoàn thành | `POST /api/contact-messages` dùng DTO, validation server-side, service, repository, Problem Details khi lỗi và trả `201 Created`. Endpoint giới hạn 5 request/phút. |
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

### Ưu tiên 1 — Đưa Contact vào môi trường thật

1. Cấu hình connection string bằng User Secrets/biến môi trường, không commit mật khẩu.
2. Áp dụng migration `InitialCreate` trên MySQL và gửi thử một message.
3. Đặt origin production vào CORS và cấu hình reverse proxy `/api` khi deploy.
4. Kiểm thử API tích hợp với MySQL, sau đó bổ sung CAPTCHA hoặc dịch vụ chống spam nếu website được public.

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
cd ../..
dotnet run --project src/PersonalPortfolio.Api
```

Sau khi MySQL đã chạy và connection string đúng, tạo bảng từ migration:

```bash
cd backend
dotnet ef database update --project src/PersonalPortfolio.Api --startup-project src/PersonalPortfolio.Api
```

```bash
cd backend
dotnet build PersonalPortfolio.sln --no-restore
```

> API Contact và migration đã có. Để gửi/lưu được message, bạn vẫn cần cấu hình MySQL và chạy `dotnet ef database update`.

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
| Form liên hệ thực tế | Sẵn sàng sau khi cấu hình MySQL, áp dụng migration và đặt đúng URL/origin production |
| Portfolio dùng dữ liệu động | Chưa sẵn sàng |
| Khu vực Admin | Chưa triển khai |
| Production deployment | Chưa sẵn sàng; cần hoàn tất bảo mật, test, migration và cấu hình môi trường |
