# Bàn giao dự án cho AI tiếp theo

> Mục đích: đọc tài liệu này trước khi sửa mã. Đây là portfolio cá nhân full-stack đang ở giai đoạn hoàn thiện website public và đưa form Contact vào môi trường thật. Không tự suy diễn rằng Admin, Blog, hay dữ liệu động đã tồn tại.

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
        ├── Contact/                  # Vertical slice Contact trên đĩa
        │   ├── Entities/             # Entity + enum
        │   ├── Contracts/            # Request/response DTO
        │   ├── Repositories/         # Abstraction và EF implementation
        │   ├── Services/             # Business/use-case layer
        │   └── ContactMessageConfiguration.cs # EF mapping
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
- Theo vertical slice: khi thêm nghiệp vụ `X`, đặt entity/contract/repository/service/configuration trong `Contact/` tương ứng hoặc thư mục feature mới cùng cấp. Controller vẫn đặt ở `Controllers/`.
- **Lệch tên đang tồn tại, không tự refactor chỉ vì thẩm mỹ:** đường dẫn vật lý là `Contact/`, nhưng namespace của các lớp là `PersonalPortfolio.Api.Features.Contact...`. Cả hai đang build cùng nhau. Nếu quyết định chuẩn hóa về `Features/Contact`, phải thực hiện có chủ đích, cập nhật toàn bộ namespace và kiểm tra migration/build; không làm lẫn trong một thay đổi tính năng nhỏ.
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
- Chưa có Swagger/OpenAPI. Đừng hướng dẫn người dùng vào URL tài liệu API cho đến khi nó được triển khai.
- Không biến toàn bộ dữ liệu tĩnh thành database/API nếu chủ sở hữu chưa chọn mô hình quản trị dữ liệu; trước hết làm đúng yêu cầu tính năng đang được giao.

## 8. Checklist trước khi bàn giao thay đổi mới

- [ ] Đặt file đúng feature/layer và tuân thủ naming ở trên.
- [ ] Nếu có API: DTO, validation server, status code, cancellation token, DI và CORS/auth tác động phù hợp.
- [ ] Nếu có schema: migration mới đã tạo, không sửa migration cũ.
- [ ] Nếu có form: validation frontend/server khớp và xử lý loading/lỗi.
- [ ] Nếu có asset/link cá nhân: dùng đúng dữ liệu chủ sở hữu đã cung cấp, không bịa URL hoặc credential.
- [ ] Chạy build/test liên quan và báo rõ cái nào chưa chạy (ví dụ vì thiếu MySQL/secret).
