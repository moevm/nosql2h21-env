FROM neo4j:4.3.1
ENV NEO4j_PASSWD=1234
ENV NEO4J_AUTH=neo4j/1234
COPY ./pollution_us_2000_2016_qm.csv ./import
COPY ./init_db.cypher .