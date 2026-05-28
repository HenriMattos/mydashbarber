# Client Portal Customization Spec

## Objective

Allow the admin to configure the customer portal identity from the Empresa area and have the portal consume those settings instead of fixed barbershop mock branding.

## Roles

- Admin/barber manager: edits portal identity.
- Customer: accesses the configured portal by slug.

## Main Flow

1. Admin opens Empresa.
2. Admin edits portal name, slug, banner, logo, slogan, description and primary color.
3. After selecting banner or logo, admin adjusts position and zoom in an edit dialog.
4. Admin applies the image crop settings.
5. Admin saves the customization.
6. Admin opens the portal from the access button.
7. Portal renders the configured identity, image framing and accent color.

## Business Rules

- Slug must be normalized to lowercase ASCII with hyphen separators.
- Empty required visual fields fall back to safe defaults.
- Invalid primary color falls back to the default green.
- Portal branding is separated from booking, appointments, plans and profile mock data.
- The current implementation uses localStorage until a backend endpoint exists.
- Banner and logo uploads are stored as local data URLs only for prototype/demo use.

## Data

Current local settings:

- id
- slug
- name
- slogan
- description
- bannerUrl
- bannerPlacement: x, y, zoom
- logoUrl
- logoPlacement: x, y, zoom
- address
- phone
- primaryColor

## Loading, Empty, Error and Success States

- Loading: portal starts with default settings and syncs stored settings on mount.
- Empty: required fields use fallback defaults.
- Error: invalid color uses fallback instead of breaking the portal.
- Success: Empresa shows feedback after saving customization.

## Future API Contract

Suggested endpoints:

- `GET /api/companies/:slug/portal-settings`
- `PATCH /api/companies/:companyId/portal-settings`

Backend must validate:

- authenticated admin permission for updates;
- companyId isolation;
- slug uniqueness;
- safe image URL or uploaded asset ownership;
- valid color format.
