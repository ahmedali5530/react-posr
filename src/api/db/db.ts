import { DB_REST_DB, DB_REST_NS, DB_REST_PASS, DB_REST_USER, withApi } from "@/api/db/settings.ts";
import { Surreal } from "surrealdb.js";
import { Tables } from "@/api/db/tables.ts";
import { ActionResult, LiveQueryResponse } from "surrealdb.js/script/types";
import { toast } from "sonner";

const db = new Surreal();

export const connect = async () => {
  await db.connect(withApi('/rpc'), {
    // Set the namespace and database for the connection
    namespace: DB_REST_NS,
    database: DB_REST_DB,

    // Set the authentication details for the connection
    auth: {
      namespace: DB_REST_NS,
      database: DB_REST_DB,
      username: DB_REST_USER,
      password: DB_REST_PASS,
    },
  });
}

export const useDB = () => {
  const query = async (sql: string, parameters?: any) => {
    // log sql in dev mode
    if(import.meta.env.DEV) {
      console.group('DB Debug')
      console.info(sql.trim(), parameters);
      console.groupEnd()
    }

    try {
      // Perform a custom advanced query
      return await db.query(sql, parameters);
    } catch ( e ) {
      console.error('ERROR while query', e, sql);
      toast.error(e);
      throw e;
    }
  }

  const select = async <T>(thing: Tables): Promise<ActionResult<Record<string, T>>[]> => {
    try{
      return await db.select(thing);
    }catch(e){
      console.log('ERROR while select', e);
      toast.error(e);
      throw e;
    }
  }

  const del = async (thing: Tables|string) => {
    try{
      return await db.delete(thing);
    }catch(e){
      console.error('ERROR while delete', e);
      toast.error(e);
      throw e;
    }
  }

  const insert = async(thing: Tables|string, data: any) => {
    try{
      return await db.insert(thing, data);
    }catch(e){
      console.error('ERROR while insert', e);
      toast.error(e);
      throw e;
    }
  }

  const update = async (thing: Tables|string, data: any) => {
    try{
      return await db.update(thing, data);
    }catch(e){
      console.error('ERROR while updating', e);
      toast.error(e);
      throw e;
    }
  }

  const patch = async (thing: Tables|string, data: any) => {
    try{
      return await db.patch(thing, data);
    }catch(e){
      console.error('ERROR while patching', e);
      toast.error(e);
      throw e;
    }
  }

  const merge = async (thing: Tables|string, data: any) => {
    try{
      return await db.merge(thing, data);
    }catch(e){
      console.error('ERROR while merging', e);
      toast.error(e);
      throw e;
    }
  }

  const live = async (thing: Tables|string, callback: (data: LiveQueryResponse) => void, diff?: boolean) => {
    try{
      return await db.live(thing, callback, diff)
    }catch(e){
      console.log('ERROR while live query', e);
      toast.error(e);
      throw e;
    }
  }

  return {
    query,
    db,
    select,
    delete: del,
    insert, create: insert,
    update,
    patch,
    merge,
    live
  }
}
