const adminTable = "CREATE TABLE adminlogin_info (admin_id SERIAL NOT NULL, admin_user_name character varying  NOT NULL, admin_firstname character varying ,admin_lastname character varying,  admin_password integer, admin_location character varying ,admin_gender character varying, refresh_token character varying, created_at timestamp with time zone, updated_at timestamp with time zone,CONSTRAINT adminsignup_info_pkey PRIMARY KEY (admin_id), CONSTRAINT adminsignup_info_ukey UNIQUE (admin_user_name))";

const runnerTable = "CREATE TABLE runner_info ( runner_id serial NOT NULL , registrant_id_ref integer,  run_category character varying , tshirt_size character varying, need_runner_kit boolean,registrant_event_id integer, bib_number character varying,  my_payment_id_ref integer, created_at timestamp without time zone,  updated_at timestamp with time zone, CONSTRAINT runner_info_pkey PRIMARY KEY (runner_id), CONSTRAINT runner_bibnumber_ukey UNIQUE (bib_number)"+
                   "INCLUDE(bib_number), CONSTRAINT runner_eventid_fkey FOREIGN KEY (registrant_event_id)  REFERENCES event_info (event_id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE SET NULL NOT VALID,"+
                   "CONSTRAINT runner_registrantid_fkey FOREIGN KEY (registrant_id_ref) REFERENCES registrant_info (registrant_id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE SET NULL NOT VALID)";
const registrantTable = "CREATE TABLE registrant_info ( registrant_id serial NOT NULL , registrant_type_ref integer,  first_name character varying ,  middle_name character varying ,last_name character varying,date_of_birth character varying , age_category character varying ,  age integer,  gender character varying , email_id character varying , password character varying,mobile_number character varying ,"+

    "address_type character varying,    address character varying ,additional_email_id character varying , city character varying ,state character varying ,pin_code character varying ,pancard_number character varying , registrant_source_ref integer, registrant_class_ref integer,"+
    "beneficiary_name character varying, emergency_contact_name character varying , emergency_contact_mobile_number character varying, need_80G_certificate boolean, certificate_80G_url character varying, blood_group character varying , created_at timestamp with time zone,  updated_at timestamp with time zone,"+
    "CONSTRAINT registrant_info_pkey PRIMARY KEY (registrant_id), CONSTRAINT registrant_classref_fkey FOREIGN KEY (registrant_class_ref) REFERENCES registrant_class_info (category_id) MATCH SIMPLE   ON UPDATE CASCADE ON DELETE SET NULL NOT VALID,"+
    "CONSTRAINT registrant_sourceref_fkey FOREIGN KEY (registrant_source_ref) REFERENCES registrant_source_info (source_id) MATCH SIMPLE   ON UPDATE CASCADE ON DELETE SET NULL NOT VALID,CONSTRAINT registrant_typeref_fkey FOREIGN KEY (registrant_type_ref) "+
    "REFERENCES registrant_type_info (type_id) MATCH SIMPLE   ON UPDATE CASCADE ON DELETE SET NULL NOT VALID)";

const paymentTable = "CREATE TABLE payment_info (payment_id serial NOT NULL , payment_type character varying ,payment_status integer, payment_amount float,payment_additional_amount integer,payment_date date,"+
    "receipt_date character varying , payment_reference_id character varying, payment_tax character varying , payment_fee integer, payment_details_id character varying ,   registrant_id_ref integer,runner_id_ref integer, created_at timestamp with time zone, CONSTRAINT payment_info_pkey PRIMARY KEY (payment_id),"+
    " CONSTRAINT payment_registrantid_fkey FOREIGN KEY (registrant_id_ref) REFERENCES registrant_info (registrant_id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE SET NULL NOT VALID,"+
    " CONSTRAINT payment_runnerid_fkey FOREIGN KEY (runner_id_ref) REFERENCES runner_info (runner_id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE SET NULL  NOT VALID)";

const eventTable = "CREATE TABLE event_info (event_id serial NOT NULL, event_name character varying, event_year integer, event_date date, event_time time without time zone,event_description character varying, event_location character varying, created_by integer,   updated_by integer,created_at timestamp with time zone,"+
    "updated_at timestamp with time zone, CONSTRAINT event_info_pkey PRIMARY KEY (event_id), CONSTRAINT event_createdby_fkey FOREIGN KEY (created_by) REFERENCES adminlogin_info (admin_id) MATCH SIMPLE  ON UPDATE CASCADE ON DELETE SET NULL NOT VALID,  CONSTRAINT event_updatedby_fkey FOREIGN KEY (updated_by)"+
    "REFERENCES adminlogin_info (admin_id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE SET NULL NOT VALID)" ;

const registrantClassTable = "CREATE TABLE  registrant_class_info (    category_id  serial NOT NULL ,    category_name character varying ,category_price character varying ,    category_ticket_count integer,    runners_allowed_count integer,    registrant_type_id_ref integer,    ticket_type_name character varying ,    ticket_type_price integer,"+  
    "registrant_source_id_ref integer,    created_by integer,    updated_by integer,    created_at timestamp with time zone,    updated_at timestamp with time zone,  CONSTRAINT registrant_class_info_pkey PRIMARY KEY (category_id), CONSTRAINT registrant_class_createdby_fkey FOREIGN KEY (created_by) REFERENCES  adminlogin_info (admin_id) MATCH SIMPLE  ON UPDATE CASCADE   ON DELETE SET NULL     NOT VALID,"+
    "CONSTRAINT registrant_class_sourceid_fkey FOREIGN KEY (registrant_source_id_ref)  REFERENCES registrant_source_info (source_id) MATCH SIMPLE  ON UPDATE CASCADE  ON DELETE SET NULL   NOT VALID, CONSTRAINT registrant_class_typeid_fkey FOREIGN KEY (registrant_type_id_ref)   REFERENCES registrant_type_info (type_id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE SET NULL NOT VALID,"+
    "CONSTRAINT registrant_class_updatedby_fkey FOREIGN KEY (updated_by)  REFERENCES adminlogin_info (admin_id) MATCH SIMPLE ON UPDATE CASCADE  ON DELETE SET NULL   NOT VALID)";

const registrantSourceTable = "CREATE TABLE  registrant_source_info (  source_id serial NOT NULL ,    source_name character varying , created_by integer, updated_by integer, created_at timestamp with time zone, updated_at timestamp with time zone, CONSTRAINT registrant_source_info_pkey PRIMARY KEY (source_id),"+
    "CONSTRAINT registrant_source_createdby_fkey FOREIGN KEY (created_by)    REFERENCES adminlogin_info (admin_id) MATCH SIMPLE   ON UPDATE CASCADE  ON DELETE SET NULL   NOT VALID, CONSTRAINT registrant_source_updatedby_fkey FOREIGN KEY (updated_by) REFERENCES adminlogin_info (admin_id) MATCH SIMPLE ON UPDATE CASCADE  ON DELETE SET NULL  NOT VALID)";

const registrantTypeTable = "CREATE TABLE registrant_type_info (type_id serial NOT NULL, type_name character varying,"+
    " created_by integer, updated_by integer, created_at timestamp with time zone,  updated_at timestamp with time zone, CONSTRAINT registrant_type_info_pkey PRIMARY KEY (type_id),"+
    "CONSTRAINT registrant_type_createdby_fkey FOREIGN KEY (created_by) REFERENCES adminlogin_info (admin_id) MATCH SIMPLE   ON UPDATE CASCADE ON DELETE SET NULL NOT VALID, CONSTRAINT registrant_type_updatedby_fkey FOREIGN KEY (updated_by) REFERENCES adminlogin_info (admin_id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE SET NULL  NOT VALID)"

const otpTable ="CREATE TABLE otp_info (otp_id integer NOT NULL,phone_number character varying, otp integer,CONSTRAINT otps_pkey PRIMARY KEY (id))";

const getUserByMail = "SELECT * FROM adminlogin_info WHERE admin_user_name = ?";

const updateRefToken = "UPDATE adminlogin_info SET refresh_token = ? WHERE admin_user_name = ?";

const checkReftoken = "SELECT * FROM adminlogin_info WHERE refresh_token =? ";

module.exports = {
    adminTable,
    runnerTable,
    registrantTable,
    getUserByMail,
    updateRefToken,
    paymentTable,
    eventTable,
    registrantClassTable,
    registrantSourceTable,
    registrantTypeTable,
    checkReftoken
};