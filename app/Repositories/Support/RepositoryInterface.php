<?php
namespace App\Repositories\Support;

interface RepositoryInterface
{
    public function getAll($columns = ['*']);

    public function paginate($perPage = 15, $columns = ['*']);

    public function create(array $data);

    public function update(array $data, $id);

    public function deleteBy($column, $value);

    public function delete($id);

    public function deleteMany($items);

    public function findById($id, $columns = ['*']);

    public function findBy($column, $value, $columns = ['*']);

}

