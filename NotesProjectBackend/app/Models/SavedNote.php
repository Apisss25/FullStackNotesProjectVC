<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class SavedNote extends Pivot
{
    protected $fillable = ['user_id', 'note_id'];

    public $timestamps = true;
}