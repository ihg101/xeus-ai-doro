/**
 * ServiceSMS.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.4 Apr 22, 2006 (06:55:48 PDT) WSDL2Java emitter.
 */

package geomex.xeus.util.sms;

public interface ServiceSMS extends javax.xml.rpc.Service {
    public java.lang.String getServiceSMSSoapAddress();

    public geomex.xeus.util.sms.ServiceSMSSoap getServiceSMSSoap() throws javax.xml.rpc.ServiceException;

    public geomex.xeus.util.sms.ServiceSMSSoap getServiceSMSSoap(java.net.URL portAddress) throws javax.xml.rpc.ServiceException;

	public java.lang.String getServiceSMSSoap12Address();

    public geomex.xeus.util.sms.ServiceSMSSoap getServiceSMSSoap12() throws javax.xml.rpc.ServiceException;

    public geomex.xeus.util.sms.ServiceSMSSoap getServiceSMSSoap12(java.net.URL portAddress) throws javax.xml.rpc.ServiceException;
}
