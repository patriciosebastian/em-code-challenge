<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('breweries', function (Blueprint $table) {
            $table->string('brewery_id')->primary();
            $table->string('name');
            $table->integer('likes')->default(0);
            $table->integer('dislikes')->default(0);
            $table->integer('favorites')->default(0);
            $table->string('website_url')->nullable();
            $table->string('phone')->nullable();
            $table->string('city');
            $table->string('state');
            $table->string('brewery_type')->nullable();
            $table->string('address_1')->nullable();
            $table->string('address_2')->nullable();
            $table->string('address_3')->nullable();
            $table->string('postal_code')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('breweries');
    }
};
