<?php

namespace App\Repositories\Support;


/**
 * Class Repository - Responsável por implementar RepositoryInterface
 * @package App\Repositories\Eloquent
 */
abstract class BaseRepository implements RepositoryInterface
{
    /**
     * @var Classe model a qual será usada para criar o model
     */
    protected $modelClass;

    /**
     * @var Builder criado a partir do model
     */
    protected $query;

    /**
     * @var Instancia do model
     */
    protected $model;

    public function __construct()
    {
        $this->makeQuery();
        $this->makeModel();
    }

    protected function makeQuery()
    {
        $this->query = app()->make($this->modelClass)->newQuery();
    }

    protected function makeModel()
    {
        $this->model = app()->make($this->modelClass);
    }

    /**
     * @param array $columns - ['colum1', 'colum2']
     * @return Model
     */
    public function getAll($columns = ['*'])
    {
       return $this->query->get($columns);
    }

    /**
     * Retorna um paginator
     * @param int $perPage
     * @param array $columns - ['colum1', 'colum2']
     * @return Illuminate\Pagination\Paginator
     */
    public function paginate($perPage = 15, $columns = ['*'])
    {
        return $this->query->paginate($perPage, $columns);
    }

    /**
     * @param array $data - ['attName' => 'value', ...]
     * @return Model
     */
    public function create(array $data)
    {
        return $this->query->create($data);
    }

    /**
     * @param array - $data ['attName' => 'value', ...]
     * @param $id
     * @param string $atribute
     * @return mixed
     */
    public function update(array $data, $id, $atribute = 'id')
    {
        return $this->query->where($atribute, '=', $id)->update($data);
    }

    /**
     * @param $id
     * @return Bool
     */
    public function delete($id, $forceDelete = false)
    {
        if($forceDelete){
            return $this->query->findOrFail($id)->forceDelete();
        }
        return $this->query->findOrFail($id)->delete();
    }

    /**
     * @param $id
     * @return Bool
     */
    public function deleteBy($column, $value)
    {
        return $this->query->where($column, '=', $value)->delete();
    }

    /**
     * @param Array $items
     * @return Bool
     */
    public function deleteMany($items)
    {
        $ids_to_delete = array_map(function($item) {
           return $item['id'];
        }, $items);
        return $this->query->whereIn('id', $ids_to_delete)->delete();   //poderia ser ->destroy([1,2,3,4,5])    tentar isso quando usar
    }

    /**
     * @param $id
     * @param array $columns
     * @return Model
     */
    public function findById($id, $columns = ['*'])
    {
        return $this->query->find($id, $columns);
    }

    /**
     * @param $field
     * @param $value
     * @param array $columns
     * @return Model
     */
    public function findBy($column, $value, $columns = ['*'])
    {
        return $this->query->where($column, '=', $value)->first($columns);
    }
}