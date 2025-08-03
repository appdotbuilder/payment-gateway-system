<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\WithdrawalRequest
 *
 * @property int $id
 * @property int $user_id
 * @property int $transaction_id
 * @property string $amount
 * @property string $bank_name
 * @property string $account_number
 * @property string $account_holder_name
 * @property string $status
 * @property string|null $admin_notes
 * @property \Illuminate\Support\Carbon|null $approved_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User $user
 * @property-read \App\Models\Transaction $transaction
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|WithdrawalRequest newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|WithdrawalRequest newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|WithdrawalRequest query()
 * @method static \Illuminate\Database\Eloquent\Builder|WithdrawalRequest pending()
 * @method static \Illuminate\Database\Eloquent\Builder|WithdrawalRequest whereAccountHolderName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|WithdrawalRequest whereAccountNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder|WithdrawalRequest whereAdminNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder|WithdrawalRequest whereAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|WithdrawalRequest whereApprovedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|WithdrawalRequest whereBankName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|WithdrawalRequest whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|WithdrawalRequest whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|WithdrawalRequest whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|WithdrawalRequest whereTransactionId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|WithdrawalRequest whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|WithdrawalRequest whereUserId($value)
 * @method static \Database\Factories\WithdrawalRequestFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class WithdrawalRequest extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'transaction_id',
        'amount',
        'bank_name',
        'account_number',
        'account_holder_name',
        'status',
        'admin_notes',
        'approved_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'amount' => 'decimal:2',
        'approved_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the user that owns the withdrawal request.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the transaction associated with the withdrawal request.
     */
    public function transaction(): BelongsTo
    {
        return $this->belongsTo(Transaction::class);
    }

    /**
     * Scope a query to only include pending withdrawal requests.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }
}