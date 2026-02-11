# Auto Import Verification Guide

This guide walks through cleaning old data, auto‑importing renamed `.glb` models, and verifying that the database reflects the new filenames.

---

## Step 1: Clean the Old Data (Optional but Recommended)

If you renamed model files, the old filenames (for example `Bed_King.glb`) may still exist in the database as **ghost entries**. These can break loading or show invalid items in the sidebar.

To start fresh and re‑seed the database, run the following in your **backend terminal**:

```bash
php artisan migrate:fresh --seed
```

**Note:**

* This wipes the tables and runs the default seeders.
* If you want to keep your current scene data and only update the catalog, **skip this step** and continue to Step 2.

---

## Step 2: Run the Auto‑Import Script

Run the auto‑import seeder that scans your models folder and inserts the updated filenames (for example `LuxuryBathtub.glb` instead of `bathtub_v2.glb`) into the database.

In your backend terminal, run:

```bash
php artisan db:seed --class=AutoImportSeeder
```

This will:

* Scan the models directory
* Detect the new `.glb` filenames
* Insert them into the furniture catalog
* Make them appear correctly in the sidebar

---

## Adding New `.glb` Models (Important Note)

This auto-import system also works for **newly added `.glb` files**.

### How to Add New Models Safely

1. Place the new `.glb` file into the same **models directory** scanned by `AutoImportSeeder`.
2. Make sure the filename is **unique** and uses the `.glb` extension.
3. Run the auto-import seeder again:

```bash
php artisan db:seed --class=AutoImportSeeder
```

The new model will automatically:

* Be detected by the seeder
* Be inserted into the database
* Appear in the furniture sidebar via the API

### When NOT to Use `migrate:fresh`

Do **not** run `php artisan migrate:fresh` when you are only adding new models.
That command is only needed for:

* Major renames or deletions
* Cleaning broken or duplicated database entries
* Full catalog resets

---

## Step 3: Verification

Confirm that the database now contains the correct filenames.

### Option A: Via Browser

Open the API endpoint in your browser:

```
http://localhost:8000/api/furniture
```

Check the `model_url` fields. They should **exactly match** your new filenames.

---

### Option B: Via Tinker (Terminal)

Run Laravel Tinker:

```bash
php artisan tinker
```

Then execute:

```php
App\Models\Furniture::all();
```

Verify that the returned records reference the updated `.glb` filenames.

---

If the names match, your auto‑import and catalog sync are working correctly.
