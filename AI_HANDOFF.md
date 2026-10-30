# Bàn giao dự án cho AI tiếp theo

> Mục đích: đọc tài liệu này trước khi sửa mã. Đây là portfolio cá nhân full-stack dùng Angular, ASP.NET Core, EF Core và MySQL, đang ở giai đoạn hoàn thiện website public và đưa form Contact vào môi trường thật. Không tự suy diễn rằng Admin, Blog, hay dữ liệu động đã tồn tại.

## 1. Phạm vi và trạng thái hiện tại

| Phần | Trạng thái thực tế |
| --- | --- |
| Website public | Một trang Home Angular đã có các section Intro, Journey, Tech Stack, Featured Projects, Contact, navbar và footer. |
| Nội dung portfolio | Phần lớn là dữ liệu tĩnh đặt ngay trong component; nhiều link/ảnh dự án và LinkedIn/email còn trống. |
| Contact end-to-end | Đã hoàn thành trong mã: Angular Reactive Form → `POST /api/contact-messages` → ASP.NET Core → EF Core → MySQL. |
| Cơ sở dữ liệu | Migration `InitialCreate` đã có nhưng chưa thể khẳng định đã được áp dụng vào MySQL nào. Cần connection string bí mật trước khi chạy. |
| API portfolio/Admin/Blog/Auth | Chưa triển khai. Không có endpoint hay giao diện quản trị tương ứng. |
| Test/CI/deploy | Chỉ có test scaffold Angular; chưa có test nghiệp vụ đáng kể, test backend, CI hoặc cấu hình production hoàn chỉnh. |

Trước khi tạo tài liệu này, repo không có thay đổi Git chưa commit. Commit gần nhất là `d1d5358 end to end Contact`; sau đó chỉ thêm `AI_HANDOFF.md` này.

## 2. Cây thư mục và nơi đặt mã

```text
personal-portfolio/
├── README.md                         # Tổng quan/chạy local hiện có
├── AI_HANDOFF.md                     # Tài liệu bàn giao này
├── frontend/                         # Angular 22 standalone application
│   ├── angular.json                  # Build/serve/test; assets lấy từ public/
│   ├── proxy.conf.json               # /api → http://localhost:5243 khi dev
│   ├── package.json                  # npm scripts và dependency
│   ├── public/
│   │   ├── images/avatar.jpg         # Ảnh profile tĩnh
│   │   └── icons/tech/*.svg          # Icon công nghệ tĩnh
│   └── src/
│       ├── main.ts                   # Bootstrap ứng dụng
│       ├── styles.scss               # CSS/SCSS toàn cục
│       └── app/
│           ├── app.ts|html|scss      # Root: navbar + router-outlet + footer
│           ├── app.config.ts         # Provider toàn cục (Router, HttpClient)
│           ├── app.routes.ts         # Route hiện chỉ có `/` → Home
│           ├── core/api/             # HTTP service dùng xuyên ứng dụng
│           │   └── contact-api.service.ts
│           ├── features/home/        # Feature Home
│           │   ├── pages/home/       # Component trang, ghép section
│           │   └── components/       # Component chỉ dành cho Home
│           │       ├── intro/
│           │       ├── journey/
│           │       ├── tech-stack/
│           │       ├── featured-projects/
│           │       └── contact/
│           └── shared/               # Thành phần tái sử dụng, không gắn feature
│               ├── components/project-card/
│               └── layout/navbar/ và footer/
└── backend/
    ├── PersonalPortfolio.sln
    └── src/PersonalPortfolio.Api/
        ├── Program.cs                # DI, CORS, rate limit, pipeline, controller
        ├── appsettings*.json         # Config không bí mật
        ├── Controllers/              # HTTP controllers
        │   └── ContactMessagesController.cs
        ├── Data/                     # DbContext và factory cho EF CLI
        ├── Features/                 # Vertical slices theo domain
        │   ├── Contact/
        │   │   ├── Entities/          # Entity + enum
        │   │   ├── Contracts/         # Request/response DTO
        │   │   ├── Repositories/      # Abstraction và EF implementation
        │   │   ├── Services/          # Business/use-case layer
        │   │   └── ContactMessageConfiguration.cs # EF mapping
        │   ├── Projects/
        │   ├── Content/
        │   └── Admin/
        ├── Migrations/               # EF Core migration + model snapshot
        └── Properties/launchSettings.json
```

## 3. Quy ước cần giữ

### Frontend

- Dùng Angular standalone component (không có `NgModule`). Component gồm cùng tên: `foo.ts`, `foo.html`, `foo.scss`, `foo.spec.ts`; selector theo dạng `app-foo`.
- Dùng class PascalCase (`Home`, `Contact`, `ProjectCard`), file và thư mục kebab-case. Component page nằm tại `features/<feature>/pages/<page>/`; component riêng của feature tại `features/<feature>/components/`; thành phần dùng lại vào `shared/`; gọi HTTP vào `core/api/`.
- TypeScript dùng single quote, indent 2 spaces theo `frontend/.editorconfig` và `.prettierrc`. Các property chỉ dùng trong template thường để `protected readonly`.
- Dùng signals khi phù hợp và Reactive Forms cho form. Giữ validation client khớp validation server; frontend không thay thế validation server.
- Static asset phải vào `frontend/public/` (được Angular copy khi build), ví dụ `/images/...`, `/icons/...`; không đặt asset mới rải trong `src/` nếu không cần import qua bundler.
- API frontend dùng đường dẫn tương đối `/api/...`, không hard-code `localhost` trong service. Dev proxy đã chuyển tiếp sang port 5243.

### Backend

- Target `.NET 10`, nullable và implicit usings bật. Giữ class/entity PascalCase; async method có hậu tố `Async`; dùng `CancellationToken` xuyên controller → service → repository.
- Theo vertical slice: khi thêm nghiệp vụ `X`, đặt entity/contract/repository/service/configuration trong `Features/<FeatureName>/`. Controller vẫn đặt ở `Controllers/`.
- Contact đã được chuẩn hóa từ thư mục vật lý `Contact/` sang `Features/Contact/`; namespace hiện tại `PersonalPortfolio.Api.Features.Contact...` khớp với đường dẫn.
- Entity database không được trả trực tiếp qua API. Tạo Contracts request/response riêng và map trong service.
- Mapping EF dùng `IEntityTypeConfiguration<T>` và được quét bởi `ApplyConfigurationsFromAssembly`. Cột DB dùng `snake_case`, bảng `contact_messages`.
- Mọi thay đổi schema phải tạo EF migration mới; không sửa migration `20261015122745_InitialCreate` đã tồn tại khi database có thể đã được áp dụng. Cập nhật `ApplicationDbContextModelSnapshot.cs` bằng lệnh EF.
- Đăng ký interface/implementation tại `Program.cs`. Endpoint mới đặt route API rõ ràng, status code và response type phù hợp.

## 4. Chi tiết luồng đã hoàn thành: Contact

```text
Contact component (Reactive Form)
  → ContactApiService POST /api/contact-messages
  → ContactMessagesController [EnableRateLimiting("contact")]
  → IContactService / ContactService
  → IContactRepository / ContactRepository
  → ApplicationDbContext / MySQL contact_messages
```

- Frontend validation: `name` 2–100, `email` hợp lệ tối đa 254, `message` 10–5000. Khi submit có loading/success/error và reset khi thành công.
- API validation lặp lại bằng Data Annotations. Thành công trả `201 Created`; message mới có `Unread`, `CreatedAt`/`UpdatedAt` theo UTC. API hiện giới hạn 5 request/phút theo policy `contact`.
- Schema `contact_messages`: `id`, `name`, `email`, `message`, `status`, `created_at`, `updated_at`; index `(status, created_at)`.
- CORS lấy từ `Cors:AllowedOrigins`; dev mặc định cho `http://localhost:4200` và `https://localhost:4200`. Production phải set origin thật, không mở CORS bừa bãi.

## 5. Những phần chưa làm và thứ tự ưu tiên đề xuất

1. **Đưa Contact chạy thật:** set `ConnectionStrings:DefaultConnection` bằng User Secrets/biến môi trường, chạy migration, rồi gửi thử từ UI. Không commit secret.
2. **Hoàn thiện nội dung public:** thay text mẫu, avatar, project image, GitHub/demo/LinkedIn/email bằng dữ liệu thật. `FeaturedProjects` hiện có đúng một project mẫu; dữ liệu nằm trong `featured-projects.ts`.
3. **UX public:** thêm Projects/Blog theo quyết định phạm vi, active navigation, responsive/accessibility (focus, label, alt text), SEO metadata và sitemap/robots khi deploy.
4. **Chỉ sau khi có yêu cầu rõ:** thiết kế dữ liệu động/API cho profile, skills, journey, projects, blog; sau đó mới tạo Admin có authentication/authorization để quản trị dữ liệu và Contact.
5. **Production quality:** anti-spam/CAPTCHA cho Contact public, logging/error handling, test unit/integration, CI, backup/migration/deploy plan.

## 6. Lệnh làm việc và kiểm tra

```powershell
# Frontend
cd frontend
npm install
npm start                 # http://localhost:4200; proxy /api → :5243
npm run build
npm test

# Backend: chỉ sau khi đã cung cấp secret / biến môi trường connection string
cd backend/src/PersonalPortfolio.Api
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "server=localhost;port=3306;database=personal_portfolio;user=YOUR_USER;password=YOUR_PASSWORD"
cd ../..
dotnet ef database update --project src/PersonalPortfolio.Api --startup-project src/PersonalPortfolio.Api
dotnet run --project src/PersonalPortfolio.Api
dotnet build PersonalPortfolio.sln --no-restore
```

Backend local lắng nghe `http://localhost:5243` (và profile HTTPS là `https://localhost:7141`). `ApplicationDbContextFactory` chỉ đọc User Secrets và environment variables để EF CLI không lấy credential từ source control.

## 7. Ràng buộc bảo mật và các điều không được tự ý làm

- Không commit password, connection string thật, token hoặc `.env`; `.gitignore` đã bỏ qua local settings/build output/node_modules.
- Không bỏ `UseHttpsRedirection`, validation API, CORS policy, rate limit Contact hoặc EF migration chỉ để “chạy được”. Nếu cần đổi, giải thích lý do và kiểm tra tác động.
- `UseAuthorization()` đang có nhưng **chưa hề có authentication scheme hay endpoint yêu cầu quyền**. Không nói Admin/API đã được bảo vệ khi chưa thêm auth hoàn chỉnh.
- Swagger/OpenAPI đã được đăng ký trong `Program.cs` và chỉ bật ở Development; URL mặc định là `/swagger` khi backend chạy ở môi trường Development.
- Không biến toàn bộ dữ liệu tĩnh thành database/API nếu chủ sở hữu chưa chọn mô hình quản trị dữ liệu; trước hết làm đúng yêu cầu tính năng đang được giao.

## 8. Quy trình bắt buộc khi AI thực hiện feature mới

AI phải làm theo thứ tự sau, không bỏ qua bước tìm code tương tự:

1. Xác định feature thuộc `Projects`, `Contact`, `Content`, `Admin` hay feature mới.
2. Kiểm tra implementation, route, entity, migration và API liên quan đang có.
3. Xác định API contract, request DTO, response DTO và business rule.
4. Cập nhật entity/configuration nếu cần; nếu đổi schema thì tạo migration mới.
5. Cập nhật repository, service và controller theo luồng Controller → Service → Repository → DbContext → MySQL.
6. Tạo hoặc cập nhật frontend API service, route và component.
7. Bảo đảm màn hình có đủ loading, error, empty và success state.
8. Kiểm tra validation, authentication/authorization, CORS và rate limit nếu có liên quan.
9. Viết hoặc cập nhật test.
10. Chạy build/test, kiểm tra diff và cập nhật tài liệu nếu API/schema/cách chạy thay đổi.

Luồng chuẩn:

```text
User → Angular component → API service → Controller
     → Feature Service → Repository → ApplicationDbContext → MySQL
     → DTO response → Frontend state → UI
```

## 9. Quy tắc mở rộng cấu trúc

Khi tạo feature backend mới, ưu tiên cấu trúc:

```text
Features/<FeatureName>/
├── Contracts/       # request/response DTO
├── Entities/        # EF Core entity
├── Repositories/    # interface và implementation
└── Services/        # business/use-case
```

Các feature mới phải đặt dưới `Features/<FeatureName>/`. Không tạo thêm module nghiệp vụ ở root backend nếu module đó thuộc một domain cụ thể.

Khi tạo feature frontend mới, ưu tiên:

```text
features/<feature>/
├── pages/
├── components/
├── data-access/
└── models/
```

API URL chỉ được đặt trong API service. Component chỉ điều phối UI và state; không truy cập `HttpClient` trực tiếp.

## 10. Quy tắc MySQL/EF Core

- Entity phải có khóa chính và kiểu dữ liệu rõ ràng.
- Mapping database dùng `IEntityTypeConfiguration<T>` và được quét bằng `ApplyConfigurationsFromAssembly`.
- Tên bảng/cột mới dùng `snake_case`, nhất quán với bảng `contact_messages` hiện có.
- Dùng UTC cho thời gian.
- Dùng `AsNoTracking()` cho truy vấn chỉ đọc.
- Tránh N+1 query; dùng projection hoặc `Include` có chủ đích.
- Không trả `IQueryable` ra khỏi repository.
- Mọi thay đổi entity/schema phải có EF migration mới.
- Không sửa migration đã chạy hoặc model snapshot bằng tay.
- Kiểm tra index, foreign key, nullable và default value trước khi tạo migration.
- Không chạy migration/test trên database production khi chưa được yêu cầu rõ ràng.
- Test database phải tách khỏi database thật.

## 11. Quy tắc API và frontend state

API mới dùng route nhất quán, ví dụ:

```text
GET    /api/projects
GET    /api/projects/{slug}
POST   /api/projects
PUT    /api/projects/{id}
DELETE /api/projects/{id}
```

- Dùng danh từ số nhiều cho resource.
- Dùng status code phù hợp: `201`, `400`, `401`, `403`, `404`, `429`, `500`.
- Lỗi API dùng `ProblemDetails`; không trả stack trace hoặc secret.
- DTO phải tách khỏi EF entity.
- Frontend phải xử lý loading, error, empty và success.
- Validation phải có ở cả frontend và backend.
- Route Admin phải có guard ở frontend và authorization ở backend; không chỉ ẩn menu để bảo vệ dữ liệu.

## 12. Quy tắc quản lý code

Branch dùng theo phạm vi thay đổi:

```text
feature/admin-projects
feature/blog-api
fix/contact-validation
refactor/project-repository
migration/add-project-metadata
test/contact-service
chore/setup-ci
```

- Mỗi commit chỉ tập trung một mục tiêu.
- Không trộn refactor lớn với feature không liên quan.
- Không commit `bin/`, `obj/`, `node_modules/`, file build hoặc secret.
- Kiểm tra diff trước khi commit.
- Review phải kiểm tra API contract, quyền, migration, test và secret.
- Cập nhật README/tài liệu khi thay đổi API, schema hoặc cách chạy.

## 13. Checklist trước khi bàn giao thay đổi mới

- [ ] Đặt file đúng feature/layer và tuân thủ naming ở trên.
- [ ] Nếu có API: DTO, validation server, status code, cancellation token, DI và CORS/auth tác động phù hợp.
- [ ] Nếu có schema: migration mới đã tạo, không sửa migration cũ.
- [ ] Nếu có form: validation frontend/server khớp và xử lý loading/lỗi.
- [ ] Nếu có asset/link cá nhân: dùng đúng dữ liệu chủ sở hữu đã cung cấp, không bịa URL hoặc credential.
- [ ] Chạy build/test liên quan và báo rõ cái nào chưa chạy (ví dụ vì thiếu MySQL/secret).
