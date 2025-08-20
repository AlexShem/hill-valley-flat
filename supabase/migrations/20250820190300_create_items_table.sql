-- Migration: Create items table for moving sale
-- Purpose: Create the main items table with all necessary fields for tracking items for sale
-- Affected tables: items (new table)
-- Special considerations: Enables RLS for security, includes comprehensive indexing for performance

-- create enum types for item condition and status
create type item_condition as enum ('new', 'excellent', 'good', 'fair');
create type item_status as enum ('available', 'reserved', 'sold');

-- create the main items table
create table if not exists items (
    -- primary key and identifiers
    id uuid primary key default gen_random_uuid(),

    -- basic item information
    title text not null check (length(title) > 0),
    category text not null check (length(category) > 0),
    brand text,
    condition item_condition not null,

    -- physical attributes
    dimensions_cm text,
    colour text,
    weight_kg decimal(8,2) check (weight_kg > 0),

    -- pricing and purchase information
    purchase_date date,
    original_price_chf decimal(10,2) check (original_price_chf >= 0),
    ask_price_chf decimal(10,2) not null check (ask_price_chf >= 0),

    -- item status and availability
    status item_status not null default 'available',

    -- media and documentation
    images text[] not null default '{}', -- array of image urls
    receipt_url text,

    -- additional information
    notes text,

    -- pickup scheduling
    pickup_window_start timestamptz,
    pickup_window_end timestamptz,

    -- display ordering
    order_index integer not null default 0,

    -- audit fields
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- add constraint to ensure pickup window end is after start
alter table items
add constraint check_pickup_window
check (pickup_window_end is null or pickup_window_start is null or pickup_window_end > pickup_window_start);

-- create indexes for performance
create index idx_items_status on items(status);
create index idx_items_category on items(category);
create index idx_items_condition on items(condition);
create index idx_items_order_index on items(order_index);
create index idx_items_created_at on items(created_at desc);
create index idx_items_pickup_window on items(pickup_window_start, pickup_window_end) where pickup_window_start is not null;

-- enable row level security on the items table
-- this ensures that access to items is controlled by policies even though the table is intended for public access
alter table items enable row level security;

-- create rls policy for anonymous users to select (read) items
-- this allows public viewing of items without authentication
create policy "allow_anonymous_select_items" on items
    for select
    to anon
    using (true); -- allows all anonymous users to view items

-- create rls policy for authenticated users to select (read) items
-- this allows authenticated users to view items
create policy "allow_authenticated_select_items" on items
    for select
    to authenticated
    using (true); -- allows all authenticated users to view items

-- create rls policy for authenticated users to insert new items
-- this allows authenticated users to add new items to the sale
create policy "allow_authenticated_insert_items" on items
    for insert
    to authenticated
    with check (true); -- allows all authenticated users to insert items

-- create rls policy for authenticated users to update items
-- this allows authenticated users to modify existing items
create policy "allow_authenticated_update_items" on items
    for update
    to authenticated
    using (true) -- allows all authenticated users to access items for updates
    with check (true); -- allows all authenticated users to update items

-- create rls policy for authenticated users to delete items
-- this allows authenticated users to remove items from the sale
create policy "allow_authenticated_delete_items" on items
    for delete
    to authenticated
    using (true); -- allows all authenticated users to delete items

-- create function to automatically update the updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- create trigger to automatically update updated_at when a row is modified
create trigger update_items_updated_at
    before update on items
    for each row
    execute function update_updated_at_column();

-- add comments to document the table structure
comment on table items is 'Main table for storing items available for sale during the moving sale';
comment on column items.id is 'Unique identifier for each item (UUID)';
comment on column items.title is 'Display name/title of the item';
comment on column items.category is 'Category classification of the item (e.g., furniture, electronics, etc.)';
comment on column items.brand is 'Brand name of the item (optional)';
comment on column items.condition is 'Physical condition of the item (new, excellent, good, fair)';
comment on column items.dimensions_cm is 'Physical dimensions in centimeters (free text format)';
comment on column items.colour is 'Primary color of the item';
comment on column items.weight_kg is 'Weight of the item in kilograms';
comment on column items.purchase_date is 'Original purchase date of the item';
comment on column items.original_price_chf is 'Original purchase price in Swiss Francs';
comment on column items.ask_price_chf is 'Asking price for the item in Swiss Francs';
comment on column items.status is 'Current availability status (available, reserved, sold)';
comment on column items.images is 'Array of image URLs for the item';
comment on column items.receipt_url is 'URL to the original purchase receipt (optional)';
comment on column items.notes is 'Additional notes or description about the item';
comment on column items.pickup_window_start is 'Start of the pickup availability window';
comment on column items.pickup_window_end is 'End of the pickup availability window';
comment on column items.order_index is 'Display order index for sorting items';
comment on column items.created_at is 'Timestamp when the item was first created';
comment on column items.updated_at is 'Timestamp when the item was last modified';
