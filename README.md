# Liberal Lawyers

Liberal Lawyers is a Laravel 12 web application (Inertia + React) for publishing legal content, managing articles and legislation files, and ingesting Dubai Gazette issues. It provides a public-facing site for reading articles and legislation, plus an authenticated admin area for content management.

**Tech stack:** PHP 8.2, Laravel 12, Inertia + React, Vite, Tailwind CSS

**Highlights:**
- Articles and legal posts with multilingual fields (EN/AR)
- Storage and management of UAE legislation PDFs
- Scrapers/scripts for Dubai Gazette and UAE legislation downloads (in `scripts/`)
- Contact form handling and admin article CRUD

## Repository structure

- `app/` — application code (Controllers, Models, Mail, Requests)
- `routes/` — web routes ([routes/web.php](routes/web.php))
- `resources/` — front-end assets and Inertia views
- `scripts/` — Node scripts for scraping and downloading legislation/Gazette PDFs
- `database/migrations/` — migrations for users, articles, legal posts, legislation files, etc.

## Requirements

- PHP ^8.2
- Composer
- Node (recommended 18+) and npm
- A database (MySQL, MariaDB, or SQLite for local development)

## Quick setup

1. Clone the repo

	git clone <repo-url>
	cd liberallawyers

2. Install PHP dependencies

	composer install

3. Install JS dependencies

	npm install

4. Copy environment and set values

	cp .env.example .env
	php artisan key:generate

5. Configure database in `.env` and run migrations

	php artisan migrate

6. (Optional) Create storage symlink

	php artisan storage:link

7. Start development servers

	npm run dev
	php artisan serve

You can also use the `composer` script `composer dev` which runs the app server, queue listener and vite concurrently in development.

## Useful commands

- Run tests: `composer test` or `php artisan test`
- Build assets: `npm run build`
- Run scrapers (node scripts located in `scripts/`) — inspect each script before running.

## Notes about the project

- The project uses multilingual columns (fields ending `_en` and `_ar`) for content.
- Migrations include tables for contact inquiries, legislation files, Dubai Gazette issues, legal posts and articles.
- Several artisan commands and npm scripts are defined in `composer.json` and `package.json` to help with development.

## Contributing

Please open issues or pull requests. Keep changes small and focused; run tests and linting before submitting.
