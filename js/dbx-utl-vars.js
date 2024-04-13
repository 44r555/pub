var g1_b1 = `
def psql_config():
    from common.km_util.km_common_util import get_configuration
    psql_hostname = get_configuration(key='psql-domain', app_name="Databricks").get('configuration_value')
    psql_db = get_configuration(key="psql-creative-digital-db", app_name="Databricks").get('configuration_value')
    psql_username = dbutils.secrets.get(scope="kvl-foundation-all-eu2-sc", key="psqlcommonjbpmdb-secrets01")
    psql_pswd = dbutils.secrets.get(scope="kvl-foundation-all-eu2-sc", key="psqlcommonjbpmdb-secrets02")
    url = f"jdbc:postgresql://{psql_hostname}:5432/{psql_db}"
    connectionProperties = {"user":psql_username, "password":psql_pswd, "driver" : "org.postgresql.Driver"}
    psycopg2_params = {"host": psql_hostname, "port": 5432, "database": psql_db, "user": psql_username, "password": psql_pswd}
    return {'url':url, 'prop':connectionProperties, 'psycopg2': psycopg2_params}


def run_psql(Query):
    df_ = spark.read.jdbc(
        url=psql_config()['url'], 
        table=f'({Query}) as t', lowerBound=1, upperBound=100000, numPartitions=100,
        properties=psql_config()['prop']
    )
    display(df_)
    return df_
`;
