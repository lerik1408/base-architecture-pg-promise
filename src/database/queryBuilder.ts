class QueryBuilder {
  private singleQuotesEscape(string: string): string {
    return string.replace(/'/g, '\'\'');
  }

  private wrapValue(value: string|boolean|null) {
    if (typeof value === 'string') {
      return `'${this.singleQuotesEscape(value)}'`;
    }
    return value;
  }

  private wrapColumn(column: string): string {
    return `"${column}"`;
  }

  private returnFields(columns?: string[]) {
    return columns?.length
      ? `RETURNING ${columns.map((column) => this.wrapColumn(column))}`
      : 'RETURNING *';
  }

  private buildInsertColumn(columns: string[]): string {
    let columnsLikeQuery: string = `("${columns.join(',')}")`;
    columnsLikeQuery = columnsLikeQuery.replace(/,/g, '", "');
    return columnsLikeQuery;
  }

  private buildInsertValue(values: Array<string|boolean|null>): string {
    let valuesLikeQuery: string = '(';
    values.forEach((value) => {
      valuesLikeQuery += `${this.wrapValue(value)}, `;
    });
    return `${valuesLikeQuery.slice(0, valuesLikeQuery.length - 2)})`;
  }

  private buildUpdateColumnWithValue(payload: any): string {
    let updateValueQuery: string = '';
    const columns = Object.keys(payload);

    columns.forEach((column) => {
      updateValueQuery += ` ${this.wrapColumn(column)} = ${this.wrapValue(payload[column])},`;
    });

    updateValueQuery = updateValueQuery.slice(0, updateValueQuery.length - 1);
    return updateValueQuery;
  }

  public buildInsertQuery(payload: object, tableName: string): string {
    const columnsQuery = this.buildInsertColumn(Object.keys(payload));
    const valuesQuery: string = this.buildInsertValue(Object.values(payload));
    return `INSERT INTO "${tableName}" ${columnsQuery} VALUES ${valuesQuery} ${this.returnFields()}`;
  }

  public buildUpdateQuery(payload: object, tableName: string, whereCondition: string): string {
    return `UPDATE "${tableName}" SET ${this.buildUpdateColumnWithValue(payload)} WHERE "${tableName}".${whereCondition} ${this.returnFields()}`;
  }

  public buildDeleteQuery(tableName: string, condition: string): string {
    return `DELETE FROM "${tableName}" WHERE "${tableName}".${condition}`;
  }
}

export default new QueryBuilder();
