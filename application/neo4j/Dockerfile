FROM neo4j:4.3.1
COPY ./pollution_us_2000_2016_qm.csv ./import
COPY ./init_db.cypher .
# CMD cat init_db.cypher | bin/cypher-shell -u neo4j -p 1234