package com.ankamagames.plugins.sysinfo;

import android.annotation.TargetApi;
import android.app.Activity;
import android.app.ActivityManager;
import android.app.ActivityManager.MemoryInfo;
import android.os.Build;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.lang.Process;
import java.io.IOException;
import java.io.InputStream;
import java.util.Scanner;

import android.util.*;

public class Sysinfo extends CordovaPlugin {
	private MemoryInfo memoryInfo;
	
	@Override
	public boolean execute(String action, JSONArray args, CallbackContext callback) {

		Activity activity = this.cordova.getActivity();
		ActivityManager m = (ActivityManager) activity.getSystemService(Activity.ACTIVITY_SERVICE);
		this.memoryInfo = new MemoryInfo();
		m.getMemoryInfo(this.memoryInfo);
		
		if (action.equals("getInfo")) {
			try {
				JSONObject r = new JSONObject();
	            r.put("cpu", this.getCpuInfo());
	            r.put("memory", this.getMemoryInfo());
	            r.put("cpuInfo", this.readCPUinfo());
	            Log.d("OUTPUT", r.toString());
	            callback.success(r);
			} catch (final Exception e) {
				callback.error(e.getMessage());
			}
		}
		
		return false;
	}
	
	public JSONObject readCPUinfo() throws JSONException{
	  ProcessBuilder cmd;
	  JSONObject cpu = new JSONObject();

	  try{
	   String[] args = {"/system/bin/cat", "/proc/cpuinfo"};
	   cmd = new ProcessBuilder(args);

	   Process process = cmd.start();
	   InputStream in = process.getInputStream();
	   byte[] re = new byte[1024];
	   while(in.read(re) != -1){
	    
	    
	    String result = new String(re);
	    String[] parts = result.split("\n");
	    for(int i = 0; i < parts.length; i++) {
	    	String[] items = parts[i].split(":");
	    	if( items.length > 0 ){
		    	String key = items[0].trim();
		    	if( key.equals( "processor" ) ){
		    		String content = items[1].trim();
		    		cpu.put("processor", content );
		    	} else if( key.equals( "vendor_id" ) ){
		    		String content = items[1].trim();
		    		cpu.put("vendor_id", content );
		    	} else if( key.equals( "model" ) ){
		    		String content = items[1].trim();
		    		cpu.put("model", content );
		    	} else if( key.equals( "model name" ) ){
		    		String content = items[1].trim();
		    		cpu.put("model_name", content );
		    	} else if( key.equals( "cpu MHz" ) ){
		    		String content = items[1].trim();
		    		cpu.put("mhz", content );
		    	} else if( key.equals( "cpu family" ) ){
		    		String content = items[1].trim();
		    		cpu.put("cpu_family", content );
		    	} else if( key.equals( "bogomips" ) ){
		    		String content = items[1].trim();
		    		cpu.put("bogomips", content );
		    	}
		    }	
	    }
	    	   }
	   in.close();
	  } catch(IOException ex){
	   ex.printStackTrace();
	  }
	  return cpu;
	 }
	
	public JSONObject getCpuInfo() {
		JSONObject cpu = new JSONObject();
		try {
			// Get CPU Core count
			String output = readSystemFile("/sys/devices/system/cpu/present");
			String[] parts = output.split("-");
			Integer cpuCount = Integer.parseInt(parts[1]) + 1;
			
			cpu.put("count", cpuCount);

			// Get CPU Core frequency
			JSONArray cpuCores = new JSONArray();
			for(int i = 0; i < cpuCount; i++) {
				Integer cpuMaxFreq = getCPUFrequencyMax(i);
				cpuCores.put(cpuMaxFreq == 0 ? null : cpuMaxFreq);
			}
			
			cpu.put("cores", cpuCores);
			
		} catch (final Exception e) { }
		return cpu;
	}
	
	public JSONObject getMemoryInfo() {
		JSONObject memory = new JSONObject();
		try {
			memory.put("available", this.memoryInfo.availMem);
			memory.put("total", this.getTotalMemory());
			memory.put("threshold", this.memoryInfo.threshold);
			memory.put("low", this.memoryInfo.lowMemory);
		} catch (final Exception e) {
			
		}
		return memory;
	}
	
	@TargetApi(Build.VERSION_CODES.JELLY_BEAN)
	public Object getTotalMemory() {
		if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN) {
			return this.memoryInfo.totalMem;
		}
		else {
			return null;
		}
	}
	
	/**
	 * @return in kiloHertz.
	 * @throws SystemUtilsException
	 */
	public int getCPUFrequencyMax(int index) throws Exception {
		return readSystemFileAsInt("/sys/devices/system/cpu/cpu" + index + "/cpufreq/cpuinfo_max_freq");
	}
	
	private String readSystemFile(final String pSystemFile) {
		String content = "";
		InputStream in = null;
		try {
	      final Process process = new ProcessBuilder(new String[] { "/system/bin/cat", pSystemFile }).start();
	      in = process.getInputStream();
	      content = readFully(in);
	    } catch (final Exception e) { } 
		return content;
	}
	
	private int readSystemFileAsInt(final String pSystemFile) throws Exception {
		String content = readSystemFile(pSystemFile);
		if (content == "") {
			return 0;
		}
		return Integer.parseInt( content );
	}
	
	private String readFully(final InputStream pInputStream) throws IOException {
		final StringBuilder sb = new StringBuilder();
		final Scanner sc = new Scanner(pInputStream);
	    while(sc.hasNextLine()) {
	      sb.append(sc.nextLine());
	    }
	    return sb.toString();
	}
}
